import * as vscode from "vscode";
import * as configUtil from "../../config/util/configUtil";
import { getRelativePathToRootFolder } from "../../../common/vscode/workspace/workspaceUtil";
import { PATH_SEPARATOR } from "../../../common/general/pathUtil";
import { wrapWithLogs } from "../../../log/util/logUtil";

type FileChanges = {
    oldUri: vscode.Uri;
    newUri: vscode.Uri;
};

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
    if (!configUtil.hasConfigForFile(oldPath) || !configUtil.hasConfigForFile(newPath)) {
        return;
    }

    const oldConfigPath = configUtil.getConfigPathForFile(oldPath);
    const newConfigPath = configUtil.getConfigPathForFile(fileChanges.newUri.fsPath);
    if (configUtil.isConfigDirty(oldConfigPath) || !configUtil.isConfigValid(oldConfigPath) ||
        configUtil.isConfigDirty(newConfigPath) || !configUtil.isConfigValid(newConfigPath)) {
        return;
    }

    const onSameRootFolder = oldConfigPath === newConfigPath;
    const oldConfig = configUtil.getConfig(oldConfigPath);
    const newConfig = onSameRootFolder ? oldConfig : configUtil.getConfig(newConfigPath);
    const oldRelativePath = getRelativePathToRootFolder(oldPath);
    const newRelativePath = getRelativePathToRootFolder(newPath);

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
        console.log(
            `Config #${configUtil.getConfigPaths().indexOf(oldConfigPath)} updated for component path change`
        );
        configUtil.saveConfig(oldConfigPath, oldConfig);
    }

    if (shouldSaveNewConfig) {
        console.log(
            `Config #${configUtil.getConfigPaths().indexOf(newConfigPath)} also updated for component path change`
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
