import * as vscode from "vscode";
import TreeItem from "./TreeItem";

export default abstract class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    public getTreeItem(item: TreeItem): TreeItem {
        return item;
    }

    public getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
        return element ? element.getChildren() : this.getRoots();
    }

    public abstract getRoots(): TreeItem[];
}
