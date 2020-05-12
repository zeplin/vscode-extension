import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";

class NoPinnedItemTreeItem extends TreeItem {
    public iconPath = new vscode.ThemeIcon("pinned");

    public constructor() {
        super(localization.sidebar.pin.emptyInfo, undefined);
    }
}

export default new NoPinnedItemTreeItem();
