import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "../../screen/data/ScreensStoreProvider";
import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import ActivityTreeDataProvider from "../../activity/tree/ActivityTreeDataProvider";

function refreshSidebar() {
    BarrelDetailsStoreProvider.clearCache();
    ScreensStoreProvider.clearCache();

    BarrelTreeDataProvider.refresh();
    ActivityTreeDataProvider.refresh();
}

export {
    refreshSidebar
};
