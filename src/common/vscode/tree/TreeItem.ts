import * as vscode from "vscode";
import TreeItemContextProvider from "./TreeItemContextProvider";

export default class TreeItem extends vscode.TreeItem {
    public constructor(
        label: string,
        private parent: TreeItem | undefined,
        private contextProvider?: TreeItemContextProvider,
        collapsibleState?: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.contextValue = this.contextProvider?.get();
    }

    public containsContext(contextValue: string): boolean {
        return this.contextProvider?.contains(contextValue) ?? false;
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve([]);
    }

    public getParent(): TreeItem | undefined {
        return this.parent;
    }
}
