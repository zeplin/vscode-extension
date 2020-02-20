import * as vscode from "vscode";
import { PATH_SEPARATOR, removeLeadingPathSeparator, toUnixPath } from "../../general/pathUtil";

function getRootFolders(): vscode.WorkspaceFolder[] {
    return vscode.workspace.workspaceFolders ?? [];
}

function getRootFolderCount(): number {
    return getRootFolders().length;
}

function isThereExactlyOneRootFolder(): boolean {
    return getRootFolderCount() === 1;
}

function areThereAnyRootFolders(): boolean {
    return getRootFolderCount() > 0;
}

function getRootFolderPaths(): string[] {
    return getRootFolders().map(folder => folder.uri.fsPath);
}

function getRootFolderPathForFile(filePath: string): string {
    return getRootFolderPaths().find(rootFolderPath => filePath.startsWith(rootFolderPath))!;
}

function getRootFolderForFile(filePath: string): vscode.WorkspaceFolder {
    return getRootFolders().find(rootFolder => filePath.startsWith(rootFolder.uri.fsPath))!;
}

function getRelativePathToRootFolder(filePath: string, showRootFolderName = false): string {
    const rootFolder = getRootFolderForFile(filePath);
    const relativePath = toUnixPath(removeLeadingPathSeparator(filePath.replace(rootFolder.uri.fsPath, "")));
    return showRootFolderName ? `${rootFolder.name}${PATH_SEPARATOR}${relativePath}` : relativePath;
}

function isInWorkspace(path: string): boolean {
    return getRootFolderPaths().some(rootFolderPath => path.startsWith(rootFolderPath));
}

export {
    getRootFolders,
    isThereExactlyOneRootFolder,
    areThereAnyRootFolders,
    getRootFolderCount,
    getRootFolderPaths,
    getRootFolderPathForFile,
    getRootFolderForFile,
    getRelativePathToRootFolder,
    isInWorkspace
};
