import * as vscode from "vscode";
import TreeItem from "./TreeItem";

export default abstract class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    protected treeView?: vscode.TreeView<TreeItem>;
    protected abstract viewId: string;
    protected showCollapseAll = false;

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
}
