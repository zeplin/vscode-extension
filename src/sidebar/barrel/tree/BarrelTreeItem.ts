import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import ScreensTreeItem from "../../screen/tree/ScreensTreeItem";
import ZeplinComponentsTreeItem from "../../zeplinComponent/tree/ZeplinComponentsTreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.Barrel,
    TreeItemContext.ZeplinLink
);

export class BarrelTreeItem extends TreeItem {
    public iconPath = this.barrel.thumbnail ? vscode.Uri.parse(this.barrel.thumbnail, true) : undefined;

    public constructor(public barrel: Barrel) {
        super(barrel.name, contextProvider, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        const children: TreeItem[] = [new ZeplinComponentsTreeItem(this.barrel)];
        if (this.barrel.type === BarrelType.Project) {
            children.unshift(new ScreensTreeItem(this.barrel));
        }

        return Promise.resolve(children);
    }
}
