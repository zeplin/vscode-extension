import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import AddBarrelToSidebarCommand from "../command/AddBarrelToSidebarCommand";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";

export default class AddBarrelTreeItem extends TreeItem {
    public iconPath = {
        light: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/light/icon-add.svg")),
        dark: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/dark/icon-add.svg"))
    };
    public command = {
        title: localization.sidebar.barrel.addAnother,
        command: AddBarrelToSidebarCommand.name
    };

    public constructor() {
        super(localization.sidebar.barrel.addAnother, undefined);
    }
}
