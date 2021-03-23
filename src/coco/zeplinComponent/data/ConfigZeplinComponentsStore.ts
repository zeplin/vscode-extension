import Result from "../../../common/domain/store/Result";
import Store from "../../../common/domain/store/Store";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ZeplinComponentsStore from "../../../common/domain/zeplinComponent/data/ZeplinComponentsStore";
import BarrelError from "../../../common/domain/zeplinComponent/model/BarrelError";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import { flatten } from "../../../common/general/arrayUtil";
import { getConfig } from "../../config/util/configUtil";

export default class ConfigZeplinComponentsStore implements Store<ZeplinComponent[], BarrelError> {
    public constructor(private configPath: string) { }

    public get = async (): Promise<Result<ZeplinComponent[], BarrelError>> => {
        const config = getConfig(this.configPath);
        const barrels = config.getValidBarrelsWithTypes();
        const results = await Promise.all(barrels.map(({ id, type }) => new ZeplinComponentsStore(id, type).get()));

        return {
            data: flatten(results.map(result => result.data)),
            errors: flatten(results.map(result => result.errors))
        };
    };

    public refresh = (): Promise<Result<ZeplinComponent[], BarrelError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
