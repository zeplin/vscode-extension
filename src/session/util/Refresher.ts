import WorkspacesStore from "../../common/domain/barrel/data/WorkspacesStore";
import BarrelsStoreProvider from "../../common/domain/barrel/data/BarrelsStoreProvider";
import BarrelDetailsStoreProvider from "../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "../../sidebar/screen/data/ScreensStoreProvider";
import BarrelTreeDataProvider from "../../sidebar/barrel/tree/BarrelTreeDataProvider";
import ActivityTreeDataProvider from "../../sidebar/activity/tree/ActivityTreeDataProvider";
import { MS_IN_HOUR } from "../../common/general/dateTimeUtil";
import { resetCroppedImageUrlCache } from "../../common/domain/image/zeplinImageUtil";
import ConfigDiagnosticsProvider from "../../coco/config/diagnostic/ConfigDiagnosticsProvider";

class Refresher {
    private lastRefreshRequested?: number;

    public refresh() {
        this.lastRefreshRequested = Date.now();

        WorkspacesStore.clearCache();
        BarrelsStoreProvider.clearCache();
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        resetCroppedImageUrlCache();
        ConfigDiagnosticsProvider.updateForOpenDocuments();
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
