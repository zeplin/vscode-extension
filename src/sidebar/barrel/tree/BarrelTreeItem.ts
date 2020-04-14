import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";

export class BarrelTreeItem extends TreeItem {
    public constructor(public barrel: Barrel) {
        super(barrel.name, vscode.TreeItemCollapsibleState.Collapsed);
    }
}
