import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import Store from "../../../common/domain/store/Store";
import BarrelError from "../../../common/domain/zeplinComponent/model/BarrelError";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";

export default class CumulativeBarrelDetailsStore implements Store<BarrelDetails[], BarrelError> {
    public constructor(private barrelId: string, private barrelType: BarrelType) { }

    public get = async (): Promise<Result<BarrelDetails[], BarrelError>> => {
        const leafId = this.barrelId;
        const leafType = this.barrelType;
        let currentId: string | undefined = leafId;
        let currentType = leafType;
        const accumulatedResult: Result<BarrelDetails[], BarrelError> = {
            data: [],
            errors: []
        };

        while (currentId) {
            const childId: string | undefined = currentId === leafId ? undefined : leafId;
            const childType: BarrelType | undefined = currentId === leafId ? undefined : leafType;

            const { data, errors }: Result<BarrelDetails, BarrelError> =
                await BarrelDetailsStoreProvider.get(currentId, currentType, childId, childType).get();

            if (errors) {
                accumulatedResult.errors!.push(...errors);
                currentId = undefined;
            }

            if (data) {
                accumulatedResult.data!.push(data);
                currentId = data.parentId;
                currentType = BarrelType.Styleguide;
            }
        }

        return accumulatedResult;
    };

    public refresh = (): Promise<Result<BarrelDetails[], BarrelError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
