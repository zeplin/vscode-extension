import * as vscode from "vscode";
import TreeItem from "./TreeItem";
import Logger from "../../../log/Logger";

export default abstract class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    protected treeView?: vscode.TreeView<TreeItem>;
    protected abstract viewId: string;
    protected showCollapseAll = false;
    private eventEmitter = new vscode.EventEmitter<TreeItem>();

    public get onDidChangeTreeData(): vscode.Event<TreeItem> {
        return this.eventEmitter.event;
    }

    public refresh() {
        this.eventEmitter.fire();
    }

    public getTreeItem(item: TreeItem): TreeItem {
        return item;
    }

    public getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
        return element ? element.getChildren() : this.getRoots();
    }

    public register(): vscode.Disposable {
        return (this.treeView = vscode.window.createTreeView(this.viewId, {
            treeDataProvider: this,
            showCollapseAll: this.showCollapseAll
        }));
    }

    public abstract getRoots(): vscode.ProviderResult<TreeItem[]>;

    public getParent(element: TreeItem): TreeItem | undefined {
        return element.getParent();
    }

    protected reveal(treeItem: TreeItem | undefined, itemDescription: string) {
        if (treeItem) {
            this.treeView?.reveal(treeItem);
        } else {
            Logger.log(`${itemDescription} could not be located on ${this.viewId}`);
        }
    }
}
