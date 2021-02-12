import Store from "../../../common/domain/store/Store";
import { getConfig } from "../../config/util/configUtil";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import Result from "../../../common/domain/store/Result";
import { flatten } from "../../../common/general/arrayUtil";
import BarrelError from "../../../common/domain/zeplinComponent/model/BarrelError";

export default class ConfigBarrelsStore implements Store<BarrelDetails[], BarrelError> {
    public constructor(private path: string) { }

    public get = async (): Promise<Result<BarrelDetails[], BarrelError>> => {
        const config = getConfig(this.path);
        const barrels = config.getValidBarrelsWithTypes();
        const results = await Promise.all(
            barrels.map(({ id, type }) => BarrelDetailsStoreProvider.get(id, type).get())
        );

        return {
            data: results.filter(result => result.data).map(result => result.data!),
            errors: flatten(results.map(result => result.errors))
        };
    };

    public refresh = (): Promise<Result<BarrelDetails[], BarrelError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
