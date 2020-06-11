import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import Activity from "./Activity";
import { getComponentUri } from "../../../common/domain/openInZeplin/util/zeplinUris";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinLinkType from "../../../common/domain/openInZeplin/model/ZeplinLinkType";

export default class ComponentActivity extends Activity {
    public constructor(private component: ZeplinComponent, private barrelId: string, private barrelType: BarrelType) {
        super(component.name, component.latestVersion);
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getComponentUri(this.barrelId, this.barrelType, this.component._id, applicationType);
    }

    public getZeplinLinkType(): ZeplinLinkType {
        return ZeplinLinkType.Component;
    }
}
