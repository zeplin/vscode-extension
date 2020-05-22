import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Activity from "../model/Activity";
import ActivityTreeItem from "./ActivityTreeItem";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";

export default class ActivitySlotTreeItem extends TreeItem {
    public iconPath = {
        light: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/light/icon-calendar.svg")),
        dark: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/dark/icon-calendar.svg"))
    };

    public constructor(slot: string, private activities: Activity[]) {
        super(slot, undefined, undefined, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        return this.activities.map(activity => new ActivityTreeItem(activity, this));
    }
}
