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

    public constructor(public barrel: BarrelDetails, title?: string) {
        super(title ?? barrel.name, contextProvider, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        const [{ components }, ...sections] = this.barrel.componentSections;
        return Promise.resolve(createList(components, sections, this.barrel));
    }
}
