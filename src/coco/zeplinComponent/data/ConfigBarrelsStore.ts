import Store from "../../../common/domain/store/Store";
import { getConfig } from "../../config/util/configUtil";
import BarrelDetailsStoreProvider from "./BarrelDetailsStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import BarrelDetails from "../model/BarrelDetails";
import Result from "../../../common/domain/store/Result";
import { flatten } from "../../../common/general/arrayUtil";
import BarrelError from "../model/BarrelError";
import { convertBarrelResult, isBarrelIdFormatValid } from "../../barrel/util/barrelUtil";

export default class ConfigBarrelsStore implements Store<BarrelDetails[], BarrelError> {
    public constructor(private path: string) { }

    public get = async (): Promise<Result<BarrelDetails[], BarrelError>> => {
        const config = getConfig(this.path);
        const projects = config.getProjects().filter(isBarrelIdFormatValid);
        const styleguides = config.getStyleguides().filter(isBarrelIdFormatValid);

        const results = await Promise.all([
            ...projects.map(
                project => BarrelDetailsStoreProvider
                    .get(project, BarrelType.Project)
                    .get()
                    .then(result => convertBarrelResult(result, BarrelType.Project, project))
            ),
            ...styleguides.map(
                styleguide => BarrelDetailsStoreProvider
                    .get(styleguide, BarrelType.Styleguide)
                    .get()
                    .then(result => convertBarrelResult(result, BarrelType.Styleguide, styleguide))
            )
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
