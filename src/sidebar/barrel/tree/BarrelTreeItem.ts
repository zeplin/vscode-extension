import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import ZeplinComponentsTreeItem from "../../zeplinComponent/tree/ZeplinComponentsTreeItem";

export class BarrelTreeItem extends TreeItem {
    public constructor(public barrel: Barrel) {
        super(barrel.name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve([new ZeplinComponentsTreeItem(this.barrel)]);
    }
}
