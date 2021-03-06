import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Activity from "../model/Activity";
import { getEmotarUrl } from "../../../common/domain/image/zeplinImageUtil";
import localization from "../../../localization";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ZeplinUriProvider from "../../../common/domain/openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import ZeplinLinkType from "../../../common/domain/openInZeplin/model/ZeplinLinkType";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.Activity,
    TreeItemContext.ZeplinLink
);

export default class ActivityTreeItem extends TreeItem implements ZeplinUriProvider {
    public iconPath = this.getThumbnail();
    public description = this.activity.dateAgo;
    public tooltip = this.activity.date.toLocaleString();

    public constructor(public activity: Activity, parent: TreeItem | undefined) {
        super(ActivityTreeItem.getLabel(activity), parent, contextProvider);
    }

    private static getLabel(activity: Activity): string {
        return !activity.user
            ? localization.sidebar.activity.updated(activity.itemName)
            : localization.sidebar.activity.updatedByUser(activity.user.username, activity.itemName);
    }

    private getThumbnail(): vscode.Uri | undefined {
        if (this.activity.user?.avatar) {
            return vscode.Uri.parse(this.activity.user.avatar);
        } else if (this.activity.user?.emotar) {
            return vscode.Uri.parse(getEmotarUrl(this.activity.user.emotar));
        } else {
            return undefined;
        }
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return this.activity.getZeplinUri(applicationType);
    }

    public getZeplinLinkType(): ZeplinLinkType {
        return this.activity.getZeplinLinkType();
    }
}
