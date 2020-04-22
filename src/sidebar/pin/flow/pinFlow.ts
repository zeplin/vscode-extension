import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import PinTreeDataProvider from "../tree/PinTreeDataProvider";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";
import * as pinUtil from "../util/pinUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import localization from "../../../localization";

function pinItem(item: TreeItem) {
    if (item.containsContext(TreeItemContext.Screen)) {
        const { screen, project } = item as ScreenTreeItem;
        pinUtil.addScreenToPinnedItems(screen, project);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent, barrel } = item as ZeplinComponentTreeItem;
        pinUtil.addComponentToPinnedItems(zeplinComponent, barrel);
    } else {
        throw new Error("Wrong item type to pin");
    }

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function unpinItem(item: TreeItem) {
    if (item.containsContext(TreeItemContext.Screen)) {
        const { screen } = item as ScreenTreeItem;
        pinUtil.removeScreenFromPinnedItems(screen);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent } = item as ZeplinComponentTreeItem;
        pinUtil.removeComponentFromPinnedItems(zeplinComponent);
    } else {
        throw new Error("Wrong item type to pin");
    }

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function askUnpinAll() {
    MessageBuilder.with(localization.sidebar.pin.askUnpinAll)
        .setModal(true)
        .addOption(localization.common.ok, () => {
            pinUtil.removeAllFromPinnedItems();
            BarrelTreeDataProvider.refresh();
            PinTreeDataProvider.refresh();
        })
        .show();
}

export {
    pinItem,
    unpinItem,
    askUnpinAll
};
