import localization from "../../../localization";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import * as sidebarUtil from "../util/barrelUtil";
import { showNotLoggedInError } from "../../../common/domain/error/errorUi";
import Session from "../../../session/Session";
import { pickBarrel } from "../../../common/domain/barrel/flow/barrelFlow";
import BarrelTreeDataProvider from "../tree/BarrelTreeDataProvider";
import StaticStore from "../../../common/domain/store/StaticStore";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import Analytics from "../../../analytics/Analytics";

type BarrelTypeLabel = { label: string; type: BarrelType };

function getBarrelTypeStore(): StaticStore<BarrelTypeLabel[]> {
    return new StaticStore<BarrelTypeLabel[]>([{
        label: localization.sidebar.barrel.addProject,
        type: BarrelType.Project
    }, {
        label: localization.sidebar.barrel.addStyleguide,
        type: BarrelType.Styleguide
    }]);
}

async function startAddBarrelToSidebarFlowWithTypeSelection() {
    // Check if user is logged, fail if not so
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    // Show barrel type picker
    const barrelTypeQuickPickProvider = new QuickPickProvider(
        getBarrelTypeStore(),
        ({ label }) => ({ label })
    );
    barrelTypeQuickPickProvider.get().title = localization.sidebar.barrel.addAnother;
    barrelTypeQuickPickProvider.get().placeholder = localization.sidebar.barrel.selectType;
    const barrelTypeLabel = await barrelTypeQuickPickProvider.startSingleSelection();

    // Fail if no barrel type is selected
    if (!barrelTypeLabel) {
        return;
    }

    return startAddBarrelToSidebarFlow(barrelTypeLabel.type);
}

function startAddProjectToSidebarFlow() {
    return startAddBarrelToSidebarFlow(BarrelType.Project);
}
function startAddStyleguideToSidebarFlow() {
    return startAddBarrelToSidebarFlow(BarrelType.Styleguide);
}

async function startAddBarrelToSidebarFlow(type: BarrelType) {
    const title = localization.common.barrel.add(type);

    // Check if user is logged, fail if not so
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    // Pick barrel
    const barrel = await pickBarrel(title, type);

    // Fail if no barrel is selected
    if (!barrel) {
        return;
    }

    // Fail if barrel is already saved
    if (sidebarUtil.isBarrelSaved(barrel)) {
        BarrelTreeDataProvider.revealBarrel(barrel);
        MessageBuilder.with(localization.common.barrel.alreadyAdded(type)).show();
        return;
    }

    // Add barrel
    sidebarUtil.saveBarrel(barrel);
    BarrelTreeDataProvider.revealBarrel(barrel);
    MessageBuilder.with(localization.sidebar.barrel.added(type)).setType(MessageType.Info).show();
    Analytics.resourceAdded(barrel.type);
}

export {
    startAddBarrelToSidebarFlowWithTypeSelection,
    startAddProjectToSidebarFlow,
    startAddStyleguideToSidebarFlow
};
