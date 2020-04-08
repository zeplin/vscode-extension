import { getStyleguideDetails } from "../../../common/domain/api/api";
import BarrelDetailsStore from "./BarrelDetailsStore";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import StyleguideDetailsResponse from "../model/StyleguideDetailsResponse";

export default class StyleguideDetailsStore extends BarrelDetailsStore<StyleguideDetailsResponse> {
    protected type = BarrelType.Styleguide;
    private childId?: string;
    private childType?: BarrelType;

    protected fetchBarrelDetails(id: string) {
        return getStyleguideDetails(id, this.childId, this.childType);
    }

    protected getParent(response: StyleguideDetailsResponse): string | undefined {
        return response.parent;
    }

    public setChild(id: string, type: BarrelType) {
        this.childId = id;
        this.childType = type;
    }
}
