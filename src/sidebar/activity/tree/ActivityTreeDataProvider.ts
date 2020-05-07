import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ActivityStore from "../data/ActivityStore";
import { getDateSlot } from "../util/activityUtil";
import Activity from "../model/Activity";
import { ActivitySlotTreeItem } from "./ActivitySlotTreeItem";
import DateSlot from "../model/DateSlot";
import ActivityErrorsTreeItem from "./ActivityErrorsTreeItem";
import localization from "../../../localization";

class ActivityTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.activity";
    protected showCollapseAll = true;
    private eventEmitter = new vscode.EventEmitter<TreeItem>();

    public get onDidChangeTreeData(): vscode.Event<TreeItem> {
        return this.eventEmitter.event;
    }

    public refresh() {
        this.eventEmitter.fire();
    }

    public async getRoots(): Promise<TreeItem[]> {
        const { data, errors } = await ActivityStore.get();

        const roots: TreeItem[] = errors?.length ? [new ActivityErrorsTreeItem(errors)] : [];

        const slots: { [slot: string]: Activity[] } = {};
        const activities = data!.sort((first, second) => second.date.getTime() - first.date.getTime());
        activities.forEach(activity => {
            const slot = getDateSlot(activity.date);
            if (!slots[slot]) {
                slots[slot] = [];
            }
            slots[slot].push(activity);
        });

        roots.push(...Object.keys(slots).map(key => new ActivitySlotTreeItem(key as DateSlot, slots[key])));
        if (!roots.length) {
            roots.push(new TreeItem(localization.sidebar.activity.noneFound));
        }
        return roots;
    }
}

export default new ActivityTreeDataProvider();
