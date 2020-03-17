import localization from "../../../localization";
import WorkspacesStore from "../data/WorkspacesStore";
import BarrelsStoreProvider from "../data/BarrelsStoreProvider";
import { getBarrelDetailRepresentation } from "../util/barrelUi";
import BarrelType from "../model/BarrelType";
import * as configUtil from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";

function startAddProjectFlow() {
    return startAddBarrelFlow(BarrelType.Project);
}
function startAddStyleguideFlow() {
    return startAddBarrelFlow(BarrelType.Styleguide);
}

async function startAddBarrelFlow(type: BarrelType) {
    const title = localization.coco.barrel.add(type);

    // Validate login and select config, fail if a modifiable config is not selected
    const configPath = await selectAndValidateConfig(title);
    if (!configPath) {
        return;
    }

    // Show workspace picker
    const workspaceQuickPickProvider = new QuickPickProvider(
        WorkspacesStore,
        workspace => ({
            label: workspace.name
        }),
        localization.coco.barrel.noWorkspaceFound
    );
    workspaceQuickPickProvider.get().title = title;
    workspaceQuickPickProvider.get().placeholder = localization.coco.barrel.selectWorkspace;
    const workspace = await workspaceQuickPickProvider.startSingleSelection();

    // Fail if no workspace is selected
    if (!workspace) {
        return;
    }

    // Show barrel picker
    const barrelQuickPickProvider = new QuickPickProvider(
        BarrelsStoreProvider.get(type, workspace._id),
        barrel => ({
            label: barrel.name,
            detail: getBarrelDetailRepresentation(barrel)
        }),
        localization.coco.barrel.noneFound(type)
    );
    barrelQuickPickProvider.get().title = title;
    barrelQuickPickProvider.get().placeholder = localization.coco.barrel.select(type, workspace.name);
    const barrel = await barrelQuickPickProvider.startSingleSelection();

    // Fail if no barrel is selected
    if (!barrel) {
        return;
    }

    // Fail if config contains barrel
    if (configUtil.containsBarrel(configPath, barrel)) {
        MessageBuilder.with(localization.coco.barrel.alreadyAdded(type)).show();
        showInEditor(configPath, { text: barrel.id });
        return;
    }

    // Add barrel
    configUtil.addBarrel(configPath, barrel);
    MessageBuilder.with(localization.coco.barrel.added(type)).setType(MessageType.Info).show();
    showInEditor(configPath, { text: barrel.id, onAdd: true });
}

export {
    startAddProjectFlow,
    startAddStyleguideFlow
};
