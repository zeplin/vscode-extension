import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import AddBarrelToSidebarCommand from "../command/AddBarrelToSidebarCommand";

class AddBarrelTreeItem extends TreeItem {
    public iconPath = new vscode.ThemeIcon("add");
    public command = {
        title: localization.sidebar.barrel.addAnother,
        command: AddBarrelToSidebarCommand.name
    };

    public constructor() {
        super(localization.sidebar.barrel.addAnother, undefined);
    }
}

export default new AddBarrelTreeItem();
