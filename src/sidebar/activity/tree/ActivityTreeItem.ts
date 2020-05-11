import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Activity from "../model/Activity";
import { getEmotarUrl } from "../../../common/domain/image/zeplinImageUtil";
import localization from "../../../localization";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.Activity,
    TreeItemContext.ZeplinLink
);

export default class ActivityTreeItem extends TreeItem {
    public iconPath = this.getThumbnail();
    public description = this.activity.dateAgo;
    public tooltip = this.activity.date.toLocaleString();

    public constructor(public activity: Activity, parent: TreeItem | undefined) {
        super(
            localization.sidebar.activity.updated(activity.user.username, activity.itemName), parent, contextProvider
        );
    }

    private getThumbnail(): vscode.Uri | undefined {
        const { avatar, emotar } = this.activity.user;

        if (avatar) {
            return vscode.Uri.parse(avatar);
        } else if (emotar) {
            return vscode.Uri.parse(getEmotarUrl(emotar));
        } else {
            return undefined;
        }
    }
}
