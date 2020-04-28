import BarrelType from "../../barrel/BarrelType";
import ZeplinComponent from "../model/ZeplinComponent";
import Store from "../../store/Store";
import BarrelDetailsStoreProvider from "./BarrelDetailsStoreProvider";
import BarrelDetails from "../model/BarrelDetails";
import Result from "../../store/Result";
import BarrelError from "../model/BarrelError";
import { convertBarrelResult } from "../../barrel/util/barrelUtil";

export default class ZeplinComponentsStore implements Store<ZeplinComponent[], BarrelError> {
    public constructor(private barrelId: string, private barrelType: BarrelType, private excludeList: string[] = []) { }

    public get = async (): Promise<Result<ZeplinComponent[], BarrelError>> => {
        const leafId = this.barrelId;
        const leafType = this.barrelType;
        let currentId: string | undefined = leafId;
        let currentType = leafType;
        const accumulatedResult: Result<ZeplinComponent[], BarrelError> = {
            data: [],
            errors: []
        };

        while (currentId) {
            const childId: string | undefined = currentId === leafId ? undefined : leafId;
            const childType: BarrelType | undefined = currentId === leafId ? undefined : leafType;

            const { data, errors }: Result<BarrelDetails, BarrelError> = await BarrelDetailsStoreProvider
                .get(currentId, currentType, childId, childType)
                .get()
                .then(
                    barrel => convertBarrelResult(barrel, currentType, currentId!) // eslint-disable-line no-loop-func
                );

            if (errors) {
                accumulatedResult.errors!.push(...errors);
                currentId = undefined; // eslint-disable-line require-atomic-updates
            }

            if (data) {
                accumulatedResult.data!.push(
                    ...data.components.filter(component => !this.excludeList.includes(component.name))
                );
                currentId = data.parentId; // eslint-disable-line require-atomic-updates
                currentType = BarrelType.Styleguide; // eslint-disable-line require-atomic-updates
            }
        }

        return accumulatedResult;
    };

    public refresh = (): Promise<Result<ZeplinComponent[], BarrelError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
