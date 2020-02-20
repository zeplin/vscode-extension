import BaseError from "../../../common/domain/error/BaseError";
import Store from "../../../common/domain/store/Store";
import ZeplinComponent from "../model/ZeplinComponent";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "./BarrelDetailsStoreProvider";
import { getConfig } from "../../config/util/configUtil";
import BarrelType from "../../barrel/model/BarrelType";
import BarrelDetails from "../model/BarrelDetails";
import { promiseAny } from "../../../common/general/promiseUtil";

type ZeplinComponentData = { component: ZeplinComponent; providerId: string; providerType: BarrelType };

export default class ZeplinComponentStore implements Store<ZeplinComponentData, BaseError> {
    public constructor(private name: string, private configPath: string) { }

    public get = (): Promise<Result<ZeplinComponentData, BaseError>> => {
        const barrels = getConfig(this.configPath).getBarrelsWithTypes();

        return promiseAny(barrels.map(async ({ id, type }): Promise<ZeplinComponentData> => {
            const leafId = id;
            const leafType = type;
            let currentId: string | undefined = leafId;
            let currentType = leafType;

            while (currentId) {
                const childId: string | undefined = currentId === leafId ? undefined : leafId;
                const childType: BarrelType | undefined = currentId === leafId ? undefined : leafType;

                const { data }: Result<BarrelDetails, BaseError> =
                    await BarrelDetailsStoreProvider.get(currentId, currentType, childId, childType).get();
                const component = data?.components.find(current => current.name === this.name);
                if (component) {
                    return {
                        component,
                        providerId: leafId,
                        providerType: leafType
                    } as ZeplinComponentData;
                } else {
                    currentId = data?.parentId;
                    currentType = BarrelType.Styleguide;
                }
            }

            throw (new Error(`Component not found in barrel ${id}`));
        })).then(data => ({
            data
        } as Result<ZeplinComponentData, BaseError>)).catch(() => ({
            errors: [new BaseError()]
        }));
    };

    public refresh = (): Promise<Result<ZeplinComponentData, BaseError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
