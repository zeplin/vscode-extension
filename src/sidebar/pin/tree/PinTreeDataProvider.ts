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
import localization from "../../../localization";

class PinTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.pinned";
    private eventEmitter = new vscode.EventEmitter<TreeItem>();

    public get onDidChangeTreeData(): vscode.Event<TreeItem> {
        return this.eventEmitter.event;
    }

    public refresh() {
        updateAnyPinnedItemsContext();
        this.eventEmitter.fire();
    }

    public register(): vscode.Disposable {
        updateAnyPinnedItemsContext();
        return super.register();
    }

    public getRoots(): TreeItem[] {
        const pinnedItems = getPinnedItems();
        return pinnedItems.length
            ? pinnedItems.map(this.toTreeItem)
            : [new TreeItem(localization.sidebar.pin.emptyInfo, undefined)];
    }

    private toTreeItem(pinData: PinData): TreeItem {
        switch (pinData.type) {
            case PinType.Screen: {
                const { screen, project } = pinData as ScreenPinData;
                return new ScreenTreeItem(screen, project, undefined);
            }
            case PinType.Component: {
                const { component, barrel } = pinData as ComponentPinData;
                return new ZeplinComponentTreeItem(component, barrel, undefined);
            }
            default:
                throw new Error("Wrong item type to show pin of");
        }
    }
}

export default new PinTreeDataProvider();
