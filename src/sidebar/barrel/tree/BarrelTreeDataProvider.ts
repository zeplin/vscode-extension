import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getSavedBarrels } from "../util/barrelUtil";
import { BarrelTreeItem } from "./BarrelTreeItem";
import localization from "../../../localization";
import ScreensTreeItem from "../../screen/tree/ScreensTreeItem";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import JumpToTreeItem from "../../jumpTo/tree/JumpToTreeItem";
import Screen from "../../screen/model/Screen";
import Barrel from "../../../common/domain/barrel/Barrel";
import ScreenSectionTreeItem from "../../screen/tree/ScreenSectionTreeItem";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import ZeplinComponentsTreeItem from "../../zeplinComponent/tree/ZeplinComponentsTreeItem";
import Logger from "../../../log/Logger";
import BarrelZeplinComponentsTreeItem from "../../zeplinComponent/tree/BarrelZeplinComponentsTreeItem";
import ZeplinComponentSectionTreeItem from "../../zeplinComponent/tree/ZeplinComponentSectionTreeItem";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";

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
            ? [JumpToTreeItem, ...savedBarrels.map(barrel => new BarrelTreeItem(barrel))]
            : [new TreeItem(localization.sidebar.barrel.emptyInfo, undefined)];
    }

    public async revealScreen(screen: Screen, project: Barrel) {
        // Find project tree item
        const projectTreeItem =
            this.getRoots().find(item => item instanceof BarrelTreeItem && item.barrel.id === project.id);

        // Find screens tree item
        const screensTreeItem = (await projectTreeItem?.getChildren())?.find(item => item instanceof ScreensTreeItem);

        let screensContainer = await screensTreeItem?.getChildren();

        // Find section tree item of screen if it is not in default section
        if (screen.sectionId) {
            screensContainer = await screensContainer
                ?.find(item => item instanceof ScreenSectionTreeItem && screen.sectionId === item.section.id)
                ?.getChildren();
        }

        // Find screen tree item
        const screenTreeItem = screensContainer
            ?.find(item => item instanceof ScreenTreeItem && item.screen._id === screen._id);

        if (screenTreeItem) {
            this.treeView?.reveal(screenTreeItem);
        } else {
            Logger.log("Screen could not be located on sidebar tree");
        }
    }

    public async revealComponent(component: ZeplinComponent, barrel: Barrel) {
        // Find barrel tree item
        const barrelTreeItem =
            this.getRoots().find(item => item instanceof BarrelTreeItem && item.barrel.id === barrel.id);

        // Find components tree item
        const componentsTreeItem =
            (await barrelTreeItem?.getChildren())?.find(item => item instanceof ZeplinComponentsTreeItem);

        let componentsContainer = await componentsTreeItem?.getChildren();

        // Find barrel components tree item is there is parent styleguides of barrel
        const barrelComponentsTreeItem = componentsContainer
            ?.find(item => item instanceof BarrelZeplinComponentsTreeItem && item.barrel.id === component.barrelId);
        if (barrelComponentsTreeItem) {
            componentsContainer = await barrelComponentsTreeItem?.getChildren();
        }

        // Traverse through section tree items
        for (const sectionId of component.sectionIds) {
            componentsContainer = await componentsContainer
                ?.find(item => item instanceof ZeplinComponentSectionTreeItem && sectionId === item.section._id)
                ?.getChildren();
        }

        // Find component tree item
        const componentTreeItem = componentsContainer
            ?.find(item => item instanceof ZeplinComponentTreeItem && item.zeplinComponent._id === component._id);

        if (componentTreeItem) {
            this.treeView?.reveal(componentTreeItem);
        } else {
            Logger.log("Component could not be located on sidebar tree");
        }
    }
}

export default new BarrelTreeDataProvider();
