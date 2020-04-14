import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { createList } from "./zeplinComponentTreeUtil";

export default class BarrelZeplinComponentsTreeItem extends TreeItem {
    public iconPath = this.barrel.thumbnail ? vscode.Uri.parse(this.barrel.thumbnail, true) : undefined;

    public constructor(private barrel: BarrelDetails, title?: string) {
        super(title ?? barrel.name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        const [{ components }, ...sections] = this.barrel.componentSections;
        return Promise.resolve(createList(components, sections));
    }
}
