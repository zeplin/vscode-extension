import * as vscode from "vscode";
import { areThereAnyRootFolders } from "../../../common/vscode/workspace/workspaceUtil";
import * as configUtil from "../util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import { Config } from "../model/Config";
import localization from "../../../localization";
import { showNoConfigError } from "../../../common/domain/error/errorUi";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";

async function tryCreateConfig() {
    if (!areThereAnyRootFolders()) {
        MessageBuilder.with(localization.coco.config.create.noWorkspaceFound).show();
    } else if (configUtil.doAllRootFoldersHaveConfig()) {
        MessageBuilder.with(localization.coco.config.create.allFoldersHaveConfig).show();
    } else if (configUtil.isThereExactlyOneRootFolderWithNoConfig()) {
        createConfig(configUtil.getRootFolderPathsWithNoConfig()[0]);
    } else {
        await askCreateConfig();
    }
}

async function askCreateConfig() {
    const workspace = await vscode.window.showQuickPick(
        configUtil.getRootFolderPathsWithNoConfig(),
        { placeHolder: localization.coco.config.create.selectFolder }
    );
    if (workspace) {
        createConfig(workspace);
    }
}

function createConfig(rootFolderPath: string) {
    const configPath = configUtil.getConfigPath(rootFolderPath);
    configUtil.saveConfig(configPath, new Config(true));
    showInEditor(configPath);
}

async function tryOpenConfig() {
    if (!areThereAnyRootFolders()) {
        MessageBuilder.with(localization.coco.config.open.noWorkspaceFound).show();
    } else if (!configUtil.areThereAnyConfigs()) {
        showNoConfigError();
    } else if (configUtil.isThereExactlyOneConfig()) {
        showInEditor(configUtil.getConfigPaths()[0]);
    } else {
        await askOpenConfig();
    }
}

async function askOpenConfig() {
    const workspace = await vscode.window.showQuickPick(
        configUtil.getRootFolderPathsWithConfig(),
        { placeHolder: localization.coco.config.open.selectFolder }
    );
    if (workspace) {
        showInEditor(configUtil.getConfigPath(workspace));
    }
}

export {
    tryCreateConfig,
    tryOpenConfig,
    createConfig
};
