import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";

export default class NoPinnedItemTreeItem extends TreeItem {
    public iconPath = {
        light: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/light/icon-pinned.svg")),
        dark: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/dark/icon-pinned.svg"))
    };

    public constructor() {
        super(localization.sidebar.pin.emptyInfo, undefined);
    }
}
