import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getSavedBarrels } from "../util/barrelUtil";
import { BarrelTreeItem } from "./BarrelTreeItem";
import localization from "../../../localization";

class BarrelTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.barrels";
    protected showCollapseAll = true;
    private eventEmitter = new vscode.EventEmitter<TreeItem>();

    public get onDidChangeTreeData(): vscode.Event<TreeItem> {
        return this.eventEmitter.event;
    }

    public refresh() {
        this.eventEmitter.fire();
    }

    public getRoots(): TreeItem[] {
        const savedBarrels = getSavedBarrels();
        return savedBarrels.length
            ? savedBarrels.map(barrel => new BarrelTreeItem(barrel))
            : [new TreeItem(localization.sidebar.barrel.emptyInfo, undefined)];
    }
}

export default new BarrelTreeDataProvider();
