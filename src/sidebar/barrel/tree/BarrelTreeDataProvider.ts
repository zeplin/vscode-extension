import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getSavedBarrels } from "../util/barrelUtil";
import { BarrelTreeItem } from "./BarrelTreeItem";

class BarrelTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.barrels";
    private eventEmitter = new vscode.EventEmitter<TreeItem>();

    public get onDidChangeTreeData(): vscode.Event<TreeItem> {
        return this.eventEmitter.event;
    }

    public refresh() {
        this.eventEmitter.fire();
    }

    public getRoots(): TreeItem[] {
        return getSavedBarrels().map(barrel => new BarrelTreeItem(barrel));
    }
}

export default new BarrelTreeDataProvider();
