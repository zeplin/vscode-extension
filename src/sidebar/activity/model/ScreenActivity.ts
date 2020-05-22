import Activity from "./Activity";
import ResponseScreen from "../../screen/model/ResponseScreen";
import { getScreenUri } from "../../../common/domain/openInZeplin/util/zeplinUris";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import ZeplinLinkType from "../../openInZeplin/model/ZeplinLinkType";

export default class ScreenActivity extends Activity {
    public constructor(private screen: ResponseScreen, private projectId: string) {
        super(screen.name, screen.latestVersion);
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getScreenUri(this.projectId, this.screen._id, applicationType);
    }

    public getZeplinLinkType(): ZeplinLinkType {
        return ZeplinLinkType.Screen;
    }
}
