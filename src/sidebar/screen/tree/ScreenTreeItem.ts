import * as vscode from "vscode";
import Screen from "../model/Screen";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import Barrel from "../../../common/domain/barrel/Barrel";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.Screen,
    TreeItemContext.ZeplinLink
);

export default class ScreenTreeItem extends TreeItem {
    public iconPath = this.screen.latestVersion.snapshot.url
        ? vscode.Uri.parse(this.screen.latestVersion.snapshot.url, true)
        : undefined;

    public constructor(public screen: Screen, public project: Barrel) {
        super(screen.name, contextProvider);
    }
}
