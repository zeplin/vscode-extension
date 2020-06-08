import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ActivityStore from "../data/ActivityStore";
import { getDateSlot } from "../util/activityUi";
import Activity from "../model/Activity";
import ActivitySlotTreeItem from "./ActivitySlotTreeItem";
import ActivityErrorsTreeItem from "./ActivityErrorsTreeItem";
import localization from "../../../localization";
import Refresher from "../../../session/util/Refresher";

class ActivityTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.activity";
    protected showCollapseAll = true;

    public register(): vscode.Disposable {
        const disposables = [super.register()];
        disposables.push(
            this.treeView!.onDidChangeVisibility(({ visible }) => {
                if (visible) {
                    Refresher.requestRefresh();
                }
            })
        );
        return vscode.Disposable.from(...disposables);
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

        roots.push(...Object.keys(slots).map(slot => new ActivitySlotTreeItem(slot, slots[slot])));
        if (!roots.length) {
            roots.push(new TreeItem(localization.sidebar.activity.noneFound, undefined));
        }
        return roots;
    }
}

export default new ActivityTreeDataProvider();
