import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";

export default class NoBarrelTreeItem extends TreeItem {
    public iconPath = {
        light: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/light/icon-info.svg")),
        dark: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/dark/icon-info.svg"))
    };

    public constructor() {
        super(localization.sidebar.barrel.emptyInfo, undefined);
    }
}
