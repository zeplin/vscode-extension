import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import JumpToSidebarItemCommand from "../command/JumpToSidebarItemCommand";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";

export default class JumpToTreeItem extends TreeItem {
    public iconPath = {
        light: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/light/icon-search.svg")),
        dark: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/dark/icon-search.svg"))
    };
    public command = {
        title: localization.sidebar.jumpTo.jumpToItem,
        command: JumpToSidebarItemCommand.name
    };

    public constructor() {
        super(localization.sidebar.jumpTo.jumpToItem, undefined);
    }
}
