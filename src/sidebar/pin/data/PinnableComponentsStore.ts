import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import { getPinnedItems } from "../util/pinUtil";
import PinType from "../model/PinType";
import ComponentPinData from "../model/ComponentPinData";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinComponentsStore from "../../../common/domain/zeplinComponent/data/ZeplinComponentsStore";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";

export default class PinnableComponentsStore implements Store<ZeplinComponent[]> {
    public constructor(private barrelId: string, private barrelType: BarrelType) { }

    public get = async (): Promise<Result<ZeplinComponent[]>> => {
        const { data: components, errors } =
            await new ZeplinComponentsStore(this.barrelId, this.barrelType, []).get();

        if (errors?.length) {
            return {
                errors
            };
        } else {
            const pinnedComponentIds = getPinnedItems()
                .filter(item => item.type === PinType.Component)
                .map(item => (item as ComponentPinData).component._id);
            return {
                data: components!.filter(component => !pinnedComponentIds.includes(component._id))
            };
        }
    };

    public refresh = (): Promise<Result<ZeplinComponent[]>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
