import Barrel from "../Barrel";
import QuickPickProvider from "../../../vscode/quickPick/QuickPickerProvider";
import WorkspacesStore from "../data/WorkspacesStore";
import localization from "../../../../localization";
import BarrelsStoreProvider from "../data/BarrelsStoreProvider";
import { getBarrelDetailRepresentation } from "../util/barrelUi";
import BarrelType from "../BarrelType";

async function pickBarrel(title: string, type: BarrelType): Promise<Barrel | undefined> {
    // Show workspace picker
    const workspaceQuickPickProvider = new QuickPickProvider(
        WorkspacesStore,
        workspace => ({
            label: workspace.name
        }),
        localization.common.barrel.noWorkspaceFound
    );
    workspaceQuickPickProvider.get().title = title;
    workspaceQuickPickProvider.get().placeholder = localization.common.barrel.selectWorkspace;
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
        localization.common.barrel.noneFound(type)
    );
    barrelQuickPickProvider.get().title = title;
    barrelQuickPickProvider.get().placeholder = localization.common.barrel.select(type, workspace.name);
    return barrelQuickPickProvider.startSingleSelection();
}

export {
    pickBarrel
};
