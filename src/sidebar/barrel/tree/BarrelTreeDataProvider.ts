import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getSavedBarrels } from "../util/barrelUtil";
import { BarrelTreeItem } from "./BarrelTreeItem";
import JumpToTreeItem from "../../jumpTo/tree/JumpToTreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import SidebarRefresher from "../../refresh/util/SidebarRefresher";
import AddBarrelTreeItem from "./AddBarrelTreeItem";

class BarrelTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.barrels";
    protected showCollapseAll = true;

    public register(): vscode.Disposable {
        const disposables = [super.register()];
        disposables.push(
            this.treeView!.onDidChangeVisibility(({ visible }) => {
                if (visible) {
                    SidebarRefresher.requestRefresh();
                }
            })
        );
        return vscode.Disposable.from(...disposables);
    }

    public getRoots(): TreeItem[] {
        const savedBarrels = getSavedBarrels();
        return savedBarrels.length ? [
            JumpToTreeItem,
            ...savedBarrels.map(barrel => new BarrelTreeItem(barrel)),
            AddBarrelTreeItem
        ] : [];
    }

    public revealBarrel(barrel: Barrel) {
        // Find barrel tree item
        const barrelTreeItem =
            this.getRoots().find(item => item instanceof BarrelTreeItem && item.barrel.id === barrel.id);

        this.reveal(barrelTreeItem, `Barrel: ${barrel.name}|${barrel.id}`);
    }
}

export default new BarrelTreeDataProvider();
