import * as vscode from "vscode";
import TreeItem from "./TreeItem";

export default abstract class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    protected abstract viewId: string;

    public getTreeItem(item: TreeItem): TreeItem {
        return item;
    }

    public getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
        return element ? element.getChildren() : this.getRoots();
    }

    public register(): vscode.Disposable {
        return vscode.window.registerTreeDataProvider(this.viewId, this);
    }

    public abstract getRoots(): TreeItem[];
}
