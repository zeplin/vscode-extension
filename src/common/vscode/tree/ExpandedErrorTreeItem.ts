import * as vscode from "vscode";
import TreeItem from "./TreeItem";

export default class ExpandedErrorTreeItem extends TreeItem {
    public constructor(title: string, private message: string, parent: TreeItem | undefined) {
        super(title, parent, undefined, vscode.TreeItemCollapsibleState.Expanded);
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve([new TreeItem(this.message, this)]);
    }
}
