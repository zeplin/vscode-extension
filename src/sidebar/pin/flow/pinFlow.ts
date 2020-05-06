import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";
import * as pinUtil from "../util/pinUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import localization from "../../../localization";
import Session from "../../../session/Session";
import { showNotLoggedInError } from "../../../common/domain/error/errorUi";
import { getSavedBarrels } from "../../barrel/util/barrelUtil";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import { startAddProjectToSidebarFlow, startAddStyleguideToSidebarFlow } from "../../barrel/flow/barrelFlow";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import StaticStore from "../../../common/domain/store/StaticStore";
import { getBarrelDetailRepresentationWithType, getBarrelDetailRepresentation } from "../../../common/domain/barrel/util/barrelUi";
import PinnableScreensStore from "../data/PinnableScreensStore";
import { getZeplinComponentDetailRepresentation } from "../../../common/domain/zeplinComponent/util/zeplinComponentUi";
import PinnableComponentsStore from "../data/PinnableComponentsStore";

function pinItem(item: TreeItem) {
    if (item.containsContext(TreeItemContext.Screen)) {
        const { screen, project } = item as ScreenTreeItem;
        pinUtil.addScreenToPinnedItems(screen, project);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent, barrel } = item as ZeplinComponentTreeItem;
        pinUtil.addComponentToPinnedItems(zeplinComponent, barrel);
    } else {
        throw new Error("Wrong item type to pin");
    }
}

function unpinItem(item: TreeItem) {
    if (item.containsContext(TreeItemContext.Screen)) {
        const { screen } = item as ScreenTreeItem;
        pinUtil.removeScreenFromPinnedItems(screen);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent } = item as ZeplinComponentTreeItem;
        pinUtil.removeComponentFromPinnedItems(zeplinComponent);
    } else {
        throw new Error("Wrong item type to pin");
    }
}

async function startPinScreenFlow() {
    // Check if user is logged, fail if not so
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    const savedProjects = getSavedBarrels().filter(barrel => barrel.type === BarrelType.Project);

    // Fail if there is no saved projects
    if (!savedProjects.length) {
        MessageBuilder.with(localization.sidebar.pin.noProjectFound)
            .addOption(localization.common.barrel.add(BarrelType.Project), startAddProjectToSidebarFlow)
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    // Check if there is only one saved project, show project picker if not so
    let project = savedProjects.length === 1 ? savedProjects[0] : undefined;
    if (!project) {
        // Show project picker
        const projectQuickPickProvider = new QuickPickProvider(
            new StaticStore(savedProjects),
            item => ({
                label: item.name,
                detail: getBarrelDetailRepresentation(item)
            })
        );
        projectQuickPickProvider.get().title = localization.sidebar.pin.pinScreen;
        projectQuickPickProvider.get().placeholder = localization.sidebar.pin.selectProject;
        project = await projectQuickPickProvider.startSingleSelection();
    }

    // Fail if no project is selected
    if (!project) {
        return;
    }

    // Show screen picker
    const screenQuickPickProvider = new QuickPickProvider(
        new PinnableScreensStore(project.id),
        item => ({
            label: item.name,
            description: item.description
        })
    );
    screenQuickPickProvider.get().title = localization.sidebar.pin.pinScreen;
    screenQuickPickProvider.get().placeholder = localization.sidebar.pin.selectScreen;
    const screen = await screenQuickPickProvider.startSingleSelection();

    // Fail if no screen is selected
    if (!screen) {
        return;
    }

    pinUtil.addScreenToPinnedItems(screen, project);
}

async function startPinComponentFlow() {
    // Check if user is logged, fail if not so
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    const savedBarrels = getSavedBarrels();

    // Fail if there is no saved barrels
    if (!savedBarrels.length) {
        MessageBuilder.with(localization.sidebar.common.noBarrelFound)
            .addOption(localization.common.barrel.add(BarrelType.Project), startAddProjectToSidebarFlow)
            .addOption(localization.common.barrel.add(BarrelType.Styleguide), startAddStyleguideToSidebarFlow)
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    // Check if there is only one saved barrel, show barrel picker if not so
    let barrel = savedBarrels.length === 1 ? savedBarrels[0] : undefined;
    if (!barrel) {
        // Show barrel picker
        const barrelQuickPickProvider = new QuickPickProvider(
            new StaticStore(savedBarrels),
            item => ({
                label: item.name,
                detail: getBarrelDetailRepresentationWithType(item)
            })
        );
        barrelQuickPickProvider.get().title = localization.sidebar.pin.pinComponent;
        barrelQuickPickProvider.get().placeholder = localization.sidebar.common.selectBarrel;
        barrel = await barrelQuickPickProvider.startSingleSelection();
    }

    // Fail if no barrel is selected
    if (!barrel) {
        return;
    }

    // Show compoenent picker
    const componentQuickPickProvider = new QuickPickProvider(
        new PinnableComponentsStore(barrel.id, barrel.type),
        item => ({
            label: item.name,
            detail: getZeplinComponentDetailRepresentation(item)
        })
    );
    componentQuickPickProvider.get().title = localization.sidebar.pin.pinComponent;
    componentQuickPickProvider.get().placeholder = localization.sidebar.pin.selectComponent;
    const component = await componentQuickPickProvider.startSingleSelection();

    // Fail if no component is selected
    if (!component) {
        return;
    }

    pinUtil.addComponentToPinnedItems(component, barrel);
}

function askUnpinAll() {
    MessageBuilder.with(localization.sidebar.pin.askUnpinAll)
        .setModal(true)
        .addOption(localization.common.ok, pinUtil.removeAllFromPinnedItems)
        .show();
}

export {
    pinItem,
    unpinItem,
    startPinScreenFlow,
    startPinComponentFlow,
    askUnpinAll
};
