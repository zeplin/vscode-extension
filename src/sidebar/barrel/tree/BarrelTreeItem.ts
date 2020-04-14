import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import ZeplinComponentsTreeItem from "../../zeplinComponent/tree/ZeplinComponentsTreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.Barrel,
    TreeItemContext.ZeplinLink
);

export class BarrelTreeItem extends TreeItem {
    public constructor(public barrel: Barrel) {
        super(barrel.name, contextProvider, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve([new ZeplinComponentsTreeItem(this.barrel)]);
    }
}
