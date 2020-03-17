import localization from "../../../localization";
import * as configUtil from "../../config/util/configUtil";
import { getActiveFilePath, showInEditor } from "../../../common/vscode/editor/editorUtil";
import {
    getRootFolderForFile, getRootFolderPathForFile, getRelativePathToRootFolder, isInWorkspace
} from "../../../common/vscode/workspace/workspaceUtil";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import ComponentPathStore from "../data/ComponentPathStore";
import { createConfig } from "../../config/flow/configFlow";
import { showNoConfigError } from "../../../common/domain/error/errorUi";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";

async function startAddComponentFlow(selectedFilePath: string | undefined = undefined) {
    // Check if there are no configs to add component to, fail if so
    if (!configUtil.areThereAnyConfigs()) {
        showNoConfigError();
        return;
    }

    // Check if there is an active non-config file, else show file picker
    let filePath = selectedFilePath ?? getActiveFilePath();
    if (!filePath || configUtil.isConfigPath(filePath)) {
        const filePathQuickPickProvider = new QuickPickProvider(
            ComponentPathStore,
            component => ({
                label: component.relative
            })
        );
        filePathQuickPickProvider.get().title = localization.coco.component.add;
        filePathQuickPickProvider.get().placeholder = localization.coco.component.writeFileName;
        const componentPath = await filePathQuickPickProvider.startSingleSelection();
        filePath = componentPath?.fs;
    }

    // Fail if no file is selected
    if (!filePath) {
        return;
    }

    // Fail if the file is not in the workspace
    if (!isInWorkspace(filePath)) {
        MessageBuilder.with(localization.coco.component.notInWorkspace).show();
        return;
    }

    // Ask to create one, if the config that the file should be added to is not created
    if (!configUtil.hasConfigForFile(filePath)) {
        MessageBuilder
            .with(localization.coco.component.configNotFound(getRootFolderForFile(filePath).name))
            .addOption(localization.coco.component.createConfigAndAdd, () => {
                createConfig(getRootFolderPathForFile(filePath!));
                startAddComponentFlow(filePath);
            })
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    const configPath = configUtil.getConfigPathForFile(filePath);

    // Check if selected config file is saved, fail if not so
    if (configUtil.isConfigDirty(configPath)) {
        MessageBuilder.with(localization.coco.common.configNotSaved).show();
        showInEditor(configPath);
        return;
    }

    // Check if selected config is valid, fail if not so
    if (!configUtil.isConfigValid(configPath)) {
        MessageBuilder.with(localization.coco.common.configInvalid).show();
        showInEditor(configPath);
        return;
    }

    // Add config
    configUtil.addComponentWithPath(filePath);
    showInEditor(configPath, { text: getRelativePathToRootFolder(filePath), onAdd: true });
}

function showComponentInConfig(filePath: string) {
    const configPath = configUtil.getConfigPathForFile(filePath);
    const relativeFilePath = getRelativePathToRootFolder(filePath);

    showInEditor(configPath, { text: relativeFilePath });
}

export {
    startAddComponentFlow,
    showComponentInConfig
};
