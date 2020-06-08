import BarrelDetailsStoreProvider from "../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "../../sidebar/screen/data/ScreensStoreProvider";
import BarrelTreeDataProvider from "../../sidebar/barrel/tree/BarrelTreeDataProvider";
import ActivityTreeDataProvider from "../../sidebar/activity/tree/ActivityTreeDataProvider";
import { MS_IN_HOUR } from "../../common/general/dateTimeUtil";
import { resetCroppedImageUrlCache } from "../../common/domain/image/zeplinImageUtil";

class Refresher {
    private lastRefreshRequested?: number;

    public refresh() {
        this.lastRefreshRequested = Date.now();

        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        resetCroppedImageUrlCache();

        BarrelTreeDataProvider.refresh();
        ActivityTreeDataProvider.refresh();
    }

    public requestRefresh() {
        if (this.refreshRequired()) {
            this.refresh();
        }
    }

    /**
     * Returns true if data is not refreshed in the last hour.
     */
    private refreshRequired(): boolean {
        return !this.lastRefreshRequested || this.lastRefreshRequested < Date.now() - MS_IN_HOUR;
    }
}

export default new Refresher();
