import BasicStore from "../../../common/domain/store/BasicStore";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import BarrelDetailsResponse from "../model/BarrelDetailsResponse";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import { getComponentsFromSections } from "../util/zeplinComponentUtil";
import BaseError from "../../../common/domain/error/BaseError";

export default abstract class BarrelDetailsStore<T extends BarrelDetailsResponse> extends BasicStore<T, BarrelDetails> {
    protected abstract type: BarrelType;

    public constructor(private id: string) {
        super();
    }

    protected fetchData(): Promise<T | BaseError> {
        return this.fetchBarrelDetails(this.id);
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
            components: getComponentsFromSections(response),
            componentSections: response.componentSections,
            screenSections: response.sections
        };
    }
}
