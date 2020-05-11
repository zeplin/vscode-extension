import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { createList } from "./zeplinComponentTreeUtil";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.ZeplinComponentBarrel,
    TreeItemContext.ZeplinLink
);

export default class BarrelZeplinComponentsTreeItem extends TreeItem {
    public iconPath = this.barrel.thumbnail ? vscode.Uri.parse(this.barrel.thumbnail, true) : undefined;

    public constructor(public barrel: BarrelDetails, title: string | undefined, parent: TreeItem | undefined) {
        super(title ?? barrel.name, parent, contextProvider, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        const [{ components }, ...sections] = this.barrel.componentSections;
        return createList(components, sections, this.barrel, this);
    }
}
