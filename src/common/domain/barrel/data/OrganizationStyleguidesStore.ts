import { getOrganizationStyleguides } from "../../api/api";
import BarrelType from "../BarrelType";
import BarrelStore from "./BarrelStore";
import ResponseBarrel from "../model/ResponseBarrel";
import StyleguidesResponse from "../model/StyleguidesResponse";
import BaseError from "../../error/BaseError";

export default class OrganizationStyleguidesStore extends BarrelStore<StyleguidesResponse> {
    protected type = BarrelType.Styleguide;

    public constructor(private id: string) {
        super();
    }

    protected fetchData(): Promise<StyleguidesResponse | BaseError> {
        return getOrganizationStyleguides(this.id);
    }

    protected extractBarrels(response: StyleguidesResponse): ResponseBarrel[] {
        return response.styleguides;
    }
}
