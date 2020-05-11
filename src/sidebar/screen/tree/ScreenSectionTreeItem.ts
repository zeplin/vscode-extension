import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ScreenSection from "../model/ScreenSection";
import ScreenTreeItem from "./ScreenTreeItem";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import Barrel from "../../../common/domain/barrel/Barrel";

function getContextProvider(section: ScreenSection): TreeItemContextProvider {
    const contexts = [TreeItemContext.ScreenSection, TreeItemContext.ZeplinLink];
    if (section.jiras.length) {
        contexts.push(TreeItemContext.Jira);
    }
    return new TreeItemContextProvider(...contexts);
}

export default class ScreenSectionTreeItem extends TreeItem {
    public constructor(public section: ScreenSection, public project: Barrel, parent: TreeItem | undefined) {
        super(section.name, parent, getContextProvider(section), vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        return this.section.screens.map(screen => new ScreenTreeItem(screen, this.project, this));
    }
}
