import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getSavedBarrels } from "../util/barrelUtil";
import { BarrelTreeItem } from "./BarrelTreeItem";
import JumpToTreeItem from "../../jumpTo/tree/JumpToTreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import Refresher from "../../../session/util/Refresher";
import AddBarrelTreeItem from "./AddBarrelTreeItem";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import localization from "../../../localization";
import NoBarrelTreeItem from "./NoBarrelTreeItem";
import { isVscodeVersionSufficient } from "../../../common/vscode/ide/vscodeUtil";
import { VIEWS_WELCOME_MIN_VERSION } from "../../../common/vscode/ide/vscodefeatureVersions";

class BarrelTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.barrels";
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

    public getRoots(): TreeItem[] {
        const savedBarrels = getSavedBarrels();
        const savedProjects = savedBarrels.filter(barrel => barrel.type === BarrelType.Project);
        const savedStyleguides = savedBarrels.filter(barrel => barrel.type === BarrelType.Styleguide);

        if (savedBarrels.length) {
            return [
                new JumpToTreeItem(),
                new AddBarrelTreeItem(),
                ...this.getBarrelTreeItems(savedProjects, localization.sidebar.barrel.projects),
                ...this.getBarrelTreeItems(savedStyleguides, localization.sidebar.barrel.styleguides)
            ];
        } else if (!isVscodeVersionSufficient(VIEWS_WELCOME_MIN_VERSION)) {
            return [new NoBarrelTreeItem()];
        } else {
            return [];
        }
    }

    private getBarrelTreeItems(barrels: Barrel[], title: string): TreeItem[] {
        return barrels.length ? [
            new TreeItem(`• ${title}`, undefined),
            ...barrels.map(barrel => new BarrelTreeItem(barrel))
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
