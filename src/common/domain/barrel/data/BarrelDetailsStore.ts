import BasicStore from "../../store/BasicStore";
import BarrelDetails from "../../zeplinComponent/model/BarrelDetails";
import BarrelDetailsResponse from "../model/BarrelDetailsResponse";
import BarrelType from "../BarrelType";
import { getComponentsFromSections } from "../../../../coco/zeplinComponent/util/zeplinComponentUtil";
import BaseError from "../../error/BaseError";
import { getProjectJiras, getProjectItemJiras } from "../../jira/util/jiraUtil";
import BarrelError from "../../zeplinComponent/model/BarrelError";

export default abstract class BarrelDetailsStore<T extends BarrelDetailsResponse>
    extends BasicStore<T, BarrelDetails, BarrelError> {
    protected abstract type: BarrelType;

    public constructor(private id: string) {
        super();
    }

    protected async fetchData(): Promise<T | BarrelError> {
        const result = await this.fetchBarrelDetails(this.id);
        return result instanceof BaseError
            ? new BarrelError(this.type, this.id, result.message, result.code)
            : result;
    }

    protected abstract fetchBarrelDetails(id: string): Promise<T | BaseError>;

    protected abstract getParent(response: T): string | undefined;

    protected extractData(response: T): BarrelDetails {
        return {
            id: response._id,
            name: response.name,
            type: this.type,
            platform: response.type,
            densityScale: response.densityScale,
            thumbnail: response.thumbnail,
            parentId: this.getParent(response),
            description: response.description,
            components: getComponentsFromSections(response, this.type),
            componentSections: response.componentSections,
            screenSections: response.sections,
            jiras: getProjectJiras(response),
            itemJiras: getProjectItemJiras(response)
        };
    }
}
