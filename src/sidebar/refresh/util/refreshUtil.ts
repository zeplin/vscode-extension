import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import ActivityTreeDataProvider from "../../activity/tree/ActivityTreeDataProvider";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { updatePinnedScreens, updatePinnedItems } from "../../pin/util/pinUtil";
import ResponseScreen from "../../screen/model/ResponseScreen";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import PinTreeDataProvider from "../../pin/tree/PinTreeDataProvider";

function updateSidebarScreens(projectId: string, screens: ResponseScreen[]) {
    updatePinnedScreens(projectId, screens);
    BarrelTreeDataProvider.refresh();
    ActivityTreeDataProvider.refresh();
}

function updateSidebarItems(barrel: BarrelDetails) {
    updatePinnedItems(barrel);
    BarrelTreeDataProvider.refresh();
    ActivityTreeDataProvider.refresh();
}

function refreshItem(item: TreeItem) {
    BarrelTreeDataProvider.refreshItem(item);
    PinTreeDataProvider.refreshItem(item);
    ActivityTreeDataProvider.refreshItem(item);
}

export {
    updateSidebarScreens,
    updateSidebarItems,
    refreshItem
};
