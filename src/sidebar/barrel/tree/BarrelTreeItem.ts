import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import ScreensTreeItem from "../../screen/tree/ScreensTreeItem";
import ZeplinComponentsTreeItem from "../../zeplinComponent/tree/ZeplinComponentsTreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";

function getContextProvider(barrel: Barrel): TreeItemContextProvider {
    const contexts = [TreeItemContext.Barrel, TreeItemContext.ZeplinLink];
    if (barrel.jiras.length) {
        contexts.push(TreeItemContext.Jira);
    }
    return new TreeItemContextProvider(...contexts);
}

export class BarrelTreeItem extends TreeItem {
    public iconPath = this.barrel.thumbnail ? vscode.Uri.parse(this.barrel.thumbnail, true) : undefined;

    public constructor(public barrel: Barrel) {
        super(barrel.name, undefined, getContextProvider(barrel), vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        const children: TreeItem[] = [new ZeplinComponentsTreeItem(this.barrel, this)];
        if (this.barrel.type === BarrelType.Project) {
            children.unshift(new ScreensTreeItem(this.barrel, this));
        }

        return Promise.resolve(children);
    }
}
