import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import ActivityTreeDataProvider from "../../activity/tree/ActivityTreeDataProvider";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { updatePinnedScreens, updatePinnedItems } from "../../pin/util/pinUtil";
import ResponseScreen from "../../screen/model/ResponseScreen";

function updateSidebarScreens(screens: ResponseScreen[]) {
    updatePinnedScreens(screens);
    BarrelTreeDataProvider.refresh();
    ActivityTreeDataProvider.refresh();
}

function updateSidebarItems(barrel: BarrelDetails) {
    updatePinnedItems(barrel);
    BarrelTreeDataProvider.refresh();
    ActivityTreeDataProvider.refresh();
}

export {
    updateSidebarScreens,
    updateSidebarItems
};
