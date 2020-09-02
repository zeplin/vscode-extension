import * as vscode from "vscode";
import * as configUtil from "../../config/util/configUtil";
import { PATH_SEPARATOR } from "../../../common/general/pathUtil";
import { wrapWithLogs } from "../../../log/util/logUtil";
import { isFileDirty } from "../../../common/vscode/editor/textDocumentUtil";
import Logger from "../../../log/Logger";
import FileChanges from "../../../common/vscode/fileChange/FileChanges";
import ConfigPaths from "../../config/util/ConfigPaths";
import ConfigFolderPaths from "../../config/util/ConfigFolderPaths";

function updateConfigOnComponentRename(event: vscode.FileRenameEvent) {
    event.files.forEach(
        fileChanges => wrapWithLogs(
            () => updateComponentPaths(fileChanges),
            "Updating config on component rename",
            true
        )
    );
}

function updateComponentPaths(fileChanges: FileChanges) {
    const oldPath = fileChanges.oldUri.fsPath;
    const newPath = fileChanges.newUri.fsPath;
    if (!ConfigPaths.hasForItem(oldPath) || !ConfigPaths.hasForItem(newPath)) {
        return;
    }

    const oldConfigPath = ConfigPaths.getForItem(oldPath);
    const newConfigPath = ConfigPaths.getForItem(fileChanges.newUri.fsPath);
    if (isFileDirty(oldConfigPath) || !configUtil.isConfigValid(oldConfigPath) ||
        isFileDirty(newConfigPath) || !configUtil.isConfigValid(newConfigPath)) {
        return;
    }

    const onSameRootFolder = oldConfigPath === newConfigPath;
    const oldConfig = configUtil.getConfig(oldConfigPath);
    const newConfig = onSameRootFolder ? oldConfig : configUtil.getConfig(newConfigPath);
    const oldRelativePath = ConfigFolderPaths.getRelativePathOf(oldPath);
    const newRelativePath = ConfigFolderPaths.getRelativePathOf(newPath);

    let shouldSaveOldConfig = false;
    let shouldSaveNewConfig = false;
    for (const component of oldConfig.getComponents()) {
        const componentRelativePath = component.path;
        const newComponentRelativePath = getNewComponentRelativePathIfMatched(
            componentRelativePath, oldRelativePath, newRelativePath
        );
        if (newComponentRelativePath) {
            component.path = newComponentRelativePath;
            shouldSaveOldConfig = true;

            if (!onSameRootFolder) {
                oldConfig.removeComponent(component);
                newConfig.addComponent(component);
                shouldSaveNewConfig = true;
            }
        }
    }

    if (shouldSaveOldConfig) {
        Logger.log(
            `Config #${ConfigPaths.getAll().indexOf(oldConfigPath)} updated for component path change`
        );
        configUtil.saveConfig(oldConfigPath, oldConfig);
    }

    if (shouldSaveNewConfig) {
        Logger.log(
            `Config #${ConfigPaths.getAll().indexOf(newConfigPath)} also updated for component path change`
        );
        configUtil.saveConfig(newConfigPath, newConfig);
    }
}

function getNewComponentRelativePathIfMatched(
    componentRelativePath: string, oldRelativePath: string, newRelativePath: string
): string | undefined {
    if (componentRelativePath === oldRelativePath) { // File rename
        return newRelativePath;
    } else if (componentRelativePath.startsWith(`${oldRelativePath}${PATH_SEPARATOR}`)) { // Folder rename
        return componentRelativePath.replace(oldRelativePath, newRelativePath);
    } else {
        return undefined;
    }
}

export {
    updateConfigOnComponentRename
};
