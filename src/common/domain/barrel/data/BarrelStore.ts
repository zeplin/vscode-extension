import ResponseBarrel from "../model/ResponseBarrel";
import BasicStore from "../../store/BasicStore";
import Barrel from "../Barrel";
import BarrelType from "../BarrelType";

export default abstract class BarrelStore<R> extends BasicStore<R, Barrel[]> {
    protected abstract type: BarrelType;

    protected abstract extractBarrels(response: R): ResponseBarrel[];

    protected extractData(response: R): Barrel[] {
        const responseBarrels = this.extractBarrels(response);

        return responseBarrels.map(responseBarrel => ({
            id: responseBarrel._id,
            name: responseBarrel.name,
            type: this.type,
            platform: responseBarrel.type,
            densityScale: responseBarrel.densityScale,
            thumbnail: responseBarrel.thumbnail
        }));
    }
}
