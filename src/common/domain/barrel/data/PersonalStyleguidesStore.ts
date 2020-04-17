import { getPersonalStyleguides } from "../../api/api";
import BarrelType from "../BarrelType";
import BarrelStore from "./BarrelStore";
import ResponseBarrel from "../model/ResponseBarrel";
import StyleguidesResponse from "../model/StyleguidesResponse";

export default class PersonalStyleguidesStore extends BarrelStore<StyleguidesResponse> {
    protected type = BarrelType.Styleguide;

    protected fetchData = getPersonalStyleguides;

    protected extractBarrels(response: StyleguidesResponse): ResponseBarrel[] {
        return response.styleguides;
    }
}
