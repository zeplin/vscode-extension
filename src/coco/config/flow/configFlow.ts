import * as vscode from "vscode";
import { areThereAnyRootFolders, isInWorkspace, getRootFolderPathForFile, isInSameRootFolder } from "../../../common/vscode/workspace/workspaceUtil";
import * as configUtil from "../util/configUtil";
import { showInEditor, getActiveFilePath } from "../../../common/vscode/editor/editorUtil";
import { Config } from "../model/Config";
import localization from "../../../localization";
import { showNoConfigError } from "../../../common/domain/error/errorUi";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import { isFileDirty } from "../../../common/vscode/editor/textDocumentUtil";
import MessageType from "../../../common/vscode/message/MessageType";
import CustomConfigs from "../util/CustomConfigs";
import ConfigPaths from "../util/ConfigPaths";
import ConfigFolderPaths from "../util/ConfigFolderPaths";

async function tryCreateConfig() {
    if (!areThereAnyRootFolders()) {
        MessageBuilder.with(localization.coco.config.create.noWorkspaceFound).show();
    } else if (ConfigFolderPaths.allHaveConfig()) {
        MessageBuilder.with(localization.coco.config.create.allFoldersHaveConfig).show();
    } else if (ConfigFolderPaths.exactlyOneWithNoConfig()) {
        createConfig(ConfigFolderPaths.getAllWithNoConfig()[0]);
    } else {
        await askCreateConfig();
    }
}

async function askCreateConfig() {
    const workspace = await vscode.window.showQuickPick(
        ConfigFolderPaths.getAllWithNoConfig(),
        { placeHolder: localization.coco.config.create.selectFolder }
    );
    if (workspace) {
        createConfig(workspace);
    }
}

function createConfig(rootFolderPath: string) {
    const configPath = ConfigPaths.getDefault(rootFolderPath);
    configUtil.saveConfig(configPath, new Config(true));
    showInEditor(configPath);
}

async function tryOpenConfig() {
    if (!areThereAnyRootFolders()) {
        MessageBuilder.with(localization.coco.config.open.noWorkspaceFound).show();
    } else if (!ConfigPaths.any()) {
        showNoConfigError();
    } else if (ConfigPaths.exactlyOne()) {
        showInEditor(ConfigPaths.getAll()[0]);
    } else {
        await askOpenConfig();
    }
}

async function askOpenConfig() {
    const configPath = await vscode.window.showQuickPick(
        ConfigPaths.getAll(),
        { placeHolder: localization.coco.config.open.selectConfig }
    );
    if (configPath) {
        showInEditor(configPath);
    }
}

async function startSetConfigFlow(selectedFilePath?: string) {
    // Fail if no file is active
    const filePath = selectedFilePath ?? getActiveFilePath();
    if (!filePath) {
        MessageBuilder.with(localization.coco.config.custom.noFileSelected).show();
        return;
    }

    // Fail if the file is not in the workspace
    if (!isInWorkspace(filePath)) {
        MessageBuilder.with(localization.coco.common.notInWorkspace).show();
        return;
    }

    // Fail if the file is already a config file
    if (ConfigPaths.include(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.alreadySet).show();
        return;
    }

    // Fail if the file is not in workspace
    if (isFileDirty(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.fileNotSaved).show();
        return;
    }

    // Fail if the file is already a config file
    if (!configUtil.isConfigValid(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.fileNotValid).show();
        return;
    }

    // Add file as config
    CustomConfigs.add(filePath);
    await MessageBuilder
        .with(localization.coco.config.custom.set)
        .addOption(localization.common.ok, () => startSetConfigRootFlow(filePath))
        .addOption(localization.common.cancel)
        .setType(MessageType.Info)
        .show();
}

async function startSetConfigRootFlow(selectedFilePath: string | undefined) {
    // Fail if no file is active
    const filePath = selectedFilePath ?? getActiveFilePath();
    if (!filePath) {
        MessageBuilder.with(localization.coco.config.custom.noFileSelected).show();
        return;
    }

    // Fail if the file is a default config file
    if (ConfigPaths.isDefault(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.defaultConfigRootCannotBeChanged).show();
        return;
    }

    // Fail if the file is not a config file
    if (!ConfigPaths.include(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.nonConfigSelected).show();
        return;
    }

    // Show root selection dialog
    const selectedPaths = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri: vscode.Uri.parse(getRootFolderPathForFile(filePath)),
        openLabel: localization.coco.config.custom.setRoot
    } as vscode.OpenDialogOptions);

    // Fail if no folder is selected
    if (!selectedPaths) {
        return;
    }

    // Fail if folder is not in the same root folder as config file
    const newRootPath = selectedPaths[0].fsPath;
    if (!isInSameRootFolder(filePath, newRootPath)) {
        MessageBuilder.with(localization.coco.common.notInWorkspace).show();
        return;
    }

    // Update root of config
    CustomConfigs.updateRoot(filePath, newRootPath);
    MessageBuilder.with(localization.coco.config.custom.rootSet).setType(MessageType.Info).show();
}

async function startUnsetConfigFlow(selectedFilePath?: string) {
    // Fail if no file is active
    const filePath = selectedFilePath ?? getActiveFilePath();
    if (!filePath) {
        MessageBuilder.with(localization.coco.config.custom.noFileSelected).show();
        return;
    }

    // Fail if the file is a default config file
    if (ConfigPaths.isDefault(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.defaultConfigCannotBeUnset).show();
        return;
    }

    // Fail if the file is not a config file
    if (!ConfigPaths.include(filePath)) {
        MessageBuilder.with(localization.coco.config.custom.nonConfigSelected).show();
        return;
    }

    CustomConfigs.remove(filePath);
    await MessageBuilder.with(localization.coco.config.custom.unset).setType(MessageType.Info).show();
}

export {
    tryCreateConfig,
    tryOpenConfig,
    createConfig,
    startSetConfigFlow,
    startSetConfigRootFlow,
    startUnsetConfigFlow
};
