import * as vscode from "vscode";
import { PATH_SEPARATOR, removeLeadingPathSeparator, toUnixPath } from "../../general/pathUtil";

/**
 * Returns open root folders in the VS Code workspace.
 */
function getRootFolders(): vscode.WorkspaceFolder[] {
    return vscode.workspace.workspaceFolders ?? [];
}

/**
 * Returns open root folder count in the VS Code workspace.
 */
function getRootFolderCount(): number {
    return getRootFolders().length;
}

/**
 * Determines whether there are any open root folders in the VS Code workspace.
 */
function areThereAnyRootFolders(): boolean {
    return getRootFolderCount() > 0;
}

/**
 * Returns open root folder paths in the VS Code workspace.
 */
function getRootFolderPaths(): string[] {
    return getRootFolders().map(folder => folder.uri.fsPath);
}

/**
 * Returns open root folder path for file.
 * @param filePath A file path.
 */
function getRootFolderPathForFile(filePath: string): string {
    return getRootFolderPaths().find(rootFolderPath => filePath.startsWith(rootFolderPath))!;
}

/**
 * Returns open root folder for file.
 * @param filePath A file path.
 */
function getRootFolderForFile(filePath: string): vscode.WorkspaceFolder {
    return getRootFolders().find(rootFolder => filePath.startsWith(rootFolder.uri.fsPath))!;
}

/**
 * Returns relative path of file to an open root folder.
 * @param filePath A file path.
 * @param showRootFolderName Whether root folder name should prefixed to the relative path.
 */
function getRelativePathToRootFolder(filePath: string, showRootFolderName = false): string {
    const rootFolder = getRootFolderForFile(filePath);
    const relativePath = toUnixPath(removeLeadingPathSeparator(filePath.replace(rootFolder.uri.fsPath, "")));
    return showRootFolderName ? `${rootFolder.name}${PATH_SEPARATOR}${relativePath}` : relativePath;
}

/**
 * Determines whether there are any open root folders in the VS Code workspace that contains given path.
 * @param path A path
 */
function isInWorkspace(path: string): boolean {
    return getRootFolderPaths().some(rootFolderPath => path.startsWith(rootFolderPath));
}

/**
 * Determines whether given paths are in the same root folder in the VS Code workspace
 * @param first A path
 * @param second Another path
 */
function isInSameRootFolder(first: string, second: string): boolean {
    return getRootFolderPaths()
        .some(rootFolderPath => first.startsWith(rootFolderPath) && second.startsWith(rootFolderPath));
}

export {
    getRootFolders,
    areThereAnyRootFolders,
    getRootFolderCount,
    getRootFolderPaths,
    getRootFolderPathForFile,
    getRootFolderForFile,
    getRelativePathToRootFolder,
    isInWorkspace,
    isInSameRootFolder
};
