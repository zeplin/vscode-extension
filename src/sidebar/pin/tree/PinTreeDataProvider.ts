import * as vscode from "vscode";
import TreeDataProvider from "../../../common/vscode/tree/TreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import { getPinnedItems } from "../util/pinUtil";
import PinData from "../model/PinData";
import PinType from "../model/PinType";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";
import ScreenPinData from "../model/ScreenPinData";
import ComponentPinData from "../model/ComponentPinData";

class PinTreeDataProvider extends TreeDataProvider {
    protected viewId = "zeplin.views.pinned";
    private eventEmitter = new vscode.EventEmitter<TreeItem>();

    public get onDidChangeTreeData(): vscode.Event<TreeItem> {
        return this.eventEmitter.event;
    }

    public refresh() {
        this.eventEmitter.fire();
    }

    public getRoots(): TreeItem[] {
        return getPinnedItems().map(this.toTreeItem);
    }

    private toTreeItem(pinData: PinData): TreeItem {
        switch (pinData.type) {
            case PinType.Screen: {
                const { screen, project } = pinData as ScreenPinData;
                return new ScreenTreeItem(screen, project);
            }
            case PinType.Component: {
                const { component, barrel } = pinData as ComponentPinData;
                return new ZeplinComponentTreeItem(component, barrel);
            }
            default:
                throw new Error("Wrong item type to show pin of");
        }
    }
}

export default new PinTreeDataProvider();
