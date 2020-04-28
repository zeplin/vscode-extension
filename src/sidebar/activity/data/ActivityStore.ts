import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import ScreensStoreProvider from "../../screen/data/ScreensStoreProvider";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import { getSavedBarrels } from "../../barrel/util/barrelUtil";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinComponentsStore from "../../../common/domain/zeplinComponent/data/ZeplinComponentsStore";
import Activity from "../model/Activity";
import { flatten } from "../../../common/general/arrayUtil";
import ComponentLike from "../../../common/domain/componentLike/model/ComponentLike";

class ActivityStore implements Store<Activity[]> {
    public get = async (): Promise<Result<Activity[]>> => {
        const barrels = getSavedBarrels();
        const projects = barrels.filter(barrel => barrel.type === BarrelType.Project);
        const results = await Promise.all([
            ...projects.map(({ id }) => ScreensStoreProvider.get(id).get().then(this.convertResult)),
            ...barrels.map(({ id, type }) => new ZeplinComponentsStore(id, type).get().then(this.convertResult))
        ]);

        return {
            data: flatten(results.map(result => result.data ?? [])),
            errors: flatten(results.map(result => result.errors ?? []))
        };
    };

    private convertResult(result: Result<ComponentLike[]>): Result<Activity[]> {
        return {
            data: result.data?.map(({ name, latestVersion }) => new Activity(name, latestVersion)),
            errors: result.errors
        };
    }

    public refresh = (): Promise<Result<Activity[]>> => {
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        return this.get();
    };
}

export default new ActivityStore();
