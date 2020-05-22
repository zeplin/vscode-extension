import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getPinnedItems, updateAnyPinnedItemsContext } from "../util/pinUtil";
import PinData from "../model/PinData";
import PinType from "../model/PinType";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";
import ScreenPinData from "../model/ScreenPinData";
import ComponentPinData from "../model/ComponentPinData";
import Screen from "../../screen/model/Screen";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import NoPinnedItemTreeItem from "./NoPinnedItemTreeItem";

class PinTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.pinned";

    public refresh() {
        updateAnyPinnedItemsContext();
        super.refresh();
    }

    public register(): vscode.Disposable {
        updateAnyPinnedItemsContext();
        return super.register();
    }

    public getRoots(): TreeItem[] {
        const pinnedItems = getPinnedItems();
        return pinnedItems.length
            ? pinnedItems.map(this.toTreeItem)
            : [new NoPinnedItemTreeItem()];
    }

    private toTreeItem(pinData: PinData): TreeItem {
        switch (pinData.type) {
            case PinType.Screen: {
                const { screen, barrel } = pinData as ScreenPinData;
                return new ScreenTreeItem(screen, barrel, undefined);
            }
            case PinType.Component: {
                const { component, barrel } = pinData as ComponentPinData;
                return new ZeplinComponentTreeItem(component, barrel, undefined);
            }
            default:
                throw new Error("Wrong item type to show pin of");
        }
    }

    public revealScreen(screen: Screen) {
        // Find screen tree item
        const screenTreeItem =
            this.getRoots().find(item => item instanceof ScreenTreeItem && item.screen._id === screen._id);

        this.reveal(screenTreeItem, `Screen: ${screen.name}|${screen._id}`);
    }

    public revealComponent(component: ResponseZeplinComponent) {
        // Find component tree item
        const componentTreeItem = this.getRoots()
            .find(item => item instanceof ZeplinComponentTreeItem && item.zeplinComponent._id === component._id);

        this.reveal(componentTreeItem, `Component: ${component.name}|${component._id}`);
    }
}

export default new PinTreeDataProvider();
