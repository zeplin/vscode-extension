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
import { isFirstOccurence } from "../../../common/general/arrayUtil";
import MessageType from "../../../common/vscode/message/MessageType";

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

async function startAddMultipleComponentsFlow(selectedFilePaths: string[] | undefined = undefined) {
    // Check if there are no configs to add component to, fail if so
    if (!configUtil.areThereAnyConfigs()) {
        showNoConfigError();
        return;
    }

    // Check if there are pre-selected component paths, else show picker
    let filePaths = selectedFilePaths;
    if (!filePaths) {
        const filePathQuickPickProvider = new QuickPickProvider(
            ComponentPathStore,
            component => ({
                label: component.relative
            })
        );
        filePathQuickPickProvider.get().title = localization.coco.component.addMultiple;
        filePathQuickPickProvider.get().placeholder = localization.coco.component.writeFileName;
        const componentPaths = await filePathQuickPickProvider.startMultipleSelection();
        filePaths = componentPaths?.map(({ fs: filePath }) => filePath);
    }

    // Fail if no file is selected
    if (!filePaths) {
        return;
    }

    const rootPaths = filePaths
        .map(getRootFolderPathForFile)
        .filter(isFirstOccurence);
    const rootPathsWithNoConfig = rootPaths.filter(path => !configUtil.hasConfigForFile(path));

    // Ask to create, if some of the configs that the files should be added to are not created
    if (rootPathsWithNoConfig.length) {
        MessageBuilder
            .with(localization.coco.component.configsNotFound)
            .addOption(localization.coco.component.createConfigsAndAdd, () => {
                rootPathsWithNoConfig.forEach(createConfig);
                startAddMultipleComponentsFlow(filePaths);
            })
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    const configPaths = rootPaths.map(configUtil.getConfigPathForFile);

    // Check if selected config files are saved, fail if not so
    const dirtyConfigPaths = configPaths.filter(configUtil.isConfigDirty);
    if (dirtyConfigPaths.length) {
        MessageBuilder.with(localization.coco.common.configsNotSaved).show();
        dirtyConfigPaths.forEach(path => showInEditor(path));
        return;
    }

    // Check if selected configs are valid, fail if not so
    const invalidConfigPaths = configPaths.filter(configPath => !configUtil.isConfigValid(configPath));
    if (invalidConfigPaths.length) {
        MessageBuilder.with(localization.coco.common.configsInvalid).show();
        invalidConfigPaths.forEach(path => showInEditor(path));
        return;
    }

    // Add components
    filePaths.forEach(configUtil.addComponentWithPath);
    configPaths.forEach(configPath => showInEditor(configPath));
    MessageBuilder.with(localization.coco.component.addedMultiple(filePaths.length)).setType(MessageType.Info).show();
}

function showComponentInConfig(filePath: string) {
    const configPath = configUtil.getConfigPathForFile(filePath);
    const relativeFilePath = getRelativePathToRootFolder(filePath);

    showInEditor(configPath, { text: relativeFilePath });
}

export {
    startAddComponentFlow,
    startAddMultipleComponentsFlow,
    showComponentInConfig
};
