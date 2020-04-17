import * as vscode from "vscode";
import Screen from "../model/Screen";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import Barrel from "../../../common/domain/barrel/Barrel";

function getContextProvider(screen: Screen): TreeItemContextProvider {
    const contexts = [TreeItemContext.Screen, TreeItemContext.ZeplinLink];
    if (screen.jiras.length) {
        contexts.push(TreeItemContext.Jira);
    }
    return new TreeItemContextProvider(...contexts);
}

export default class ScreenTreeItem extends TreeItem {
    public iconPath = vscode.Uri.parse(this.screen.thumbnail, true);

    public constructor(public screen: Screen, public project: Barrel) {
        super(screen.name, getContextProvider(screen));
    }
}
