import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ScreenSection from "../model/ScreenSection";
import ScreenTreeItem from "./ScreenTreeItem";

export default class ScreenSectionTreeItem extends TreeItem {
    public constructor(private section: ScreenSection) {
        super(section.name, undefined, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve(this.section.screens.map(screen => new ScreenTreeItem(screen)));
    }
}
