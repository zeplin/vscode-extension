import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Activity from "../model/Activity";
import { ActivityTreeItem } from "./ActivityTreeItem";
import DateSlot from "../model/DateSlot";
import localization from "../../../localization";

export class ActivitySlotTreeItem extends TreeItem {
    public constructor(slot: DateSlot, private activities: Activity[]) {
        super(localization.sidebar.activity.dateSlot(slot), undefined, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve(this.activities.map(activity => new ActivityTreeItem(activity)));
    }
}
