import Activity from "./Activity";
import ResponseScreen from "../../screen/model/ResponseScreen";
import { getScreenUrl } from "../../../common/domain/openInZeplin/util/zeplinUrls";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";

export default class ScreenActivity extends Activity {
    public constructor(private screen: ResponseScreen, private projectId: string) {
        super(screen.name, screen.latestVersion);
    }

    public getZeplinUrl(applicationType: ApplicationType): string {
        return getScreenUrl(this.projectId, this.screen._id, applicationType);
    }
}
