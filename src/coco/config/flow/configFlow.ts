import * as vscode from "vscode";
import { areThereAnyRootFolders, isInWorkspace, getRootFolderPathForFile, isInSameRootFolder } from "../../../common/vscode/workspace/workspaceUtil";
import * as configUtil from "../util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import { Config } from "../model/Config";
import localization from "../../../localization";
import { showNoConfigError } from "../../../common/domain/error/errorUi";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
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

export {
    tryCreateConfig,
    tryOpenConfig,
    createConfig
};
