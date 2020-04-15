import * as vscode from "vscode";
import Screen from "../model/Screen";
import TreeItem from "../../../common/vscode/tree/TreeItem";

export default class ScreenTreeItem extends TreeItem {
    public iconPath = this.screen.latestVersion.snapshot.url
        ? vscode.Uri.parse(this.screen.latestVersion.snapshot.url, true)
        : undefined;

    public constructor(private screen: Screen) {
        super(screen.name);
    }
}
