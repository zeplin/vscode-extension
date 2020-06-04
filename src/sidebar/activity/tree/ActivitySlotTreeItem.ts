import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Activity from "../model/Activity";
import ActivityTreeItem from "./ActivityTreeItem";
import { getThemedIconUris } from "../../../common/general/iconPathUtil";

export default class ActivitySlotTreeItem extends TreeItem {
    public iconPath = getThemedIconUris("icon-calendar.svg");

    public constructor(slot: string, private activities: Activity[]) {
        super(slot, undefined, undefined, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        return this.activities.map(activity => new ActivityTreeItem(activity, this));
    }
}
