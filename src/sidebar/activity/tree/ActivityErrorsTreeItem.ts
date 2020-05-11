import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import BaseError from "../../../common/domain/error/BaseError";
import BarrelError from "../../../common/domain/zeplinComponent/model/BarrelError";
import ScreensError from "../../screen/model/ScreensError";

export default class ActivityErrorsTreeItem extends TreeItem {
    public constructor(private errors: BaseError[]) {
        super(localization.sidebar.activity.errors, undefined, undefined, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        return this.errors.map(error => new TreeItem(this.getErrorMessage(error), this));
    }

    private getErrorMessage(error: BaseError) {
        if (error instanceof BarrelError) {
            return localization.sidebar.activity.componentsError(error.id);
        } else if (error instanceof ScreensError) {
            return localization.sidebar.activity.screensError(error.barrelId);
        } else {
            return error.message;
        }
    }
}
