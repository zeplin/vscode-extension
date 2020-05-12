import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import Activity from "./Activity";
import { getComponentUrl } from "../../../common/domain/openInZeplin/util/zeplinUrls";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import BarrelType from "../../../common/domain/barrel/BarrelType";

export default class ComponentActivity extends Activity {
    public constructor(private component: ZeplinComponent, private barrelId: string, private barrelType: BarrelType) {
        super(component.name, component.latestVersion);
    }

    public getZeplinUrl(applicationType: ApplicationType): string {
        return getComponentUrl(this.barrelId, this.barrelType, this.component._id, applicationType);
    }
}
