import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import ScreensStoreProvider from "../../screen/data/ScreensStoreProvider";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import { getSavedBarrels } from "../../barrel/util/barrelUtil";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinComponentsStore from "../../../common/domain/zeplinComponent/data/ZeplinComponentsStore";
import Activity from "../model/Activity";
import { flatten } from "../../../common/general/arrayUtil";
import ScreenActivity from "../model/ScreenActivity";
import ComponentActivity from "../model/ComponentActivity";

class ActivityStore implements Store<Activity[]> {
    public get = async (): Promise<Result<Activity[]>> => {
        const barrels = getSavedBarrels();
        const projects = barrels.filter(barrel => barrel.type === BarrelType.Project);
        const results = await Promise.all([
            ...projects.map(({ id }) => ScreensStoreProvider.get(id).get().then(
                result => ({
                    data: result.data?.map(screen => new ScreenActivity(screen, id)),
                    errors: result.errors
                } as Result<Activity[]>)
            )),
            ...barrels.map(({ id, type }) => new ZeplinComponentsStore(id, type).get().then(
                result => ({
                    data: result.data?.map(component => new ComponentActivity(component, id, type)),
                    errors: result.errors
                } as Result<Activity[]>)
            ))
        ]);

        return {
            data: flatten(results.map(result => result.data ?? [])),
            errors: flatten(results.map(result => result.errors ?? []))
        };
    };

    public refresh = (): Promise<Result<Activity[]>> => {
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        return this.get();
    };
}

export default new ActivityStore();
