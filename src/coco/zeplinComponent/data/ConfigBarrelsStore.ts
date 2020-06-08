import Store from "../../../common/domain/store/Store";
import { getConfig } from "../../config/util/configUtil";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import Result from "../../../common/domain/store/Result";
import { flatten, isFirstOccurence } from "../../../common/general/arrayUtil";
import BarrelError from "../../../common/domain/zeplinComponent/model/BarrelError";
import { isBarrelIdFormatValid } from "../../../common/domain/barrel/util/barrelUtil";

export default class ConfigBarrelsStore implements Store<BarrelDetails[], BarrelError> {
    public constructor(private path: string) { }

    public get = async (): Promise<Result<BarrelDetails[], BarrelError>> => {
        const config = getConfig(this.path);
        const projects = config.getProjects().filter(isFirstOccurence).filter(isBarrelIdFormatValid);
        const styleguides = config.getStyleguides().filter(isFirstOccurence).filter(isBarrelIdFormatValid);

        const results = await Promise.all([
            ...projects.map(project => BarrelDetailsStoreProvider.get(project, BarrelType.Project).get()),
            ...styleguides.map(styleguide => BarrelDetailsStoreProvider.get(styleguide, BarrelType.Styleguide).get())
        ]);

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
