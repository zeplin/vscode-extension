import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "../../screen/data/ScreensStoreProvider";
import Screen from "../../screen/model/Screen";
import ProjectScreensStore from "../../screen/data/ProjectScreensStore";
import { flatten } from "../../../common/general/arrayUtil";
import { getPinnedItems } from "../util/pinUtil";
import PinType from "../model/PinType";
import ScreenPinData from "../model/ScreenPinData";

export default class PinnableScreensStore implements Store<Screen[]> {
    public constructor(private projectId: string) { }

    public get = async (): Promise<Result<Screen[]>> => {
        const { data: projectScreens, errors } = await new ProjectScreensStore(this.projectId).get();

        if (errors?.length) {
            return {
                errors
            };
        } else {
            const { screens, sections } = projectScreens!;
            const pinnedScreenIds = getPinnedItems()
                .filter(item => item.type === PinType.Screen)
                .map(item => (item as ScreenPinData).screen._id);
            return {
                data: flatten([screens, ...sections.map(section => section.screens)])
                    .filter(screen => !pinnedScreenIds.includes(screen._id))
            };
        }
    };

    public refresh = (): Promise<Result<Screen[]>> => {
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        return this.get();
    };
}
