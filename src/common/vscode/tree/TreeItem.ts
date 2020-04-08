import * as vscode from "vscode";

export default class TreeItem extends vscode.TreeItem {
    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve([]);
    }
}
