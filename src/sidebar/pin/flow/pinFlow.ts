import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import PinTreeDataProvider from "../tree/PinTreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";
import {
    addScreenToPinnedItems, addComponentToPinnedItems, removeScreenFromPinnedItems, removeComponentFromPinnedItems
} from "../util/pinUtil";

function pinItem(item: TreeItem) {
    if (item.containsContext(TreeItemContext.Screen)) {
        const { screen, project } = item as ScreenTreeItem;
        addScreenToPinnedItems(screen, project);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent, barrel } = item as ZeplinComponentTreeItem;
        addComponentToPinnedItems(zeplinComponent, barrel);
    } else {
        throw new Error("Wrong item type to pin");
    }

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function unpinItem(item: TreeItem) {
    if (item.containsContext(TreeItemContext.Screen)) {
        const { screen } = item as ScreenTreeItem;
        removeScreenFromPinnedItems(screen);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent } = item as ZeplinComponentTreeItem;
        removeComponentFromPinnedItems(zeplinComponent);
    } else {
        throw new Error("Wrong item type to pin");
    }

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

export {
    pinItem,
    unpinItem
};
