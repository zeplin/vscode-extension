import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinComponentsStore from "../../../common/domain/zeplinComponent/data/ZeplinComponentsStore";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import Screen from "../../screen/model/Screen";
import ProjectScreensStore from "../../screen/data/ProjectScreensStore";
import { flatten } from "../../../common/general/arrayUtil";
import BarrelError from "../../../common/domain/zeplinComponent/model/BarrelError";
import { getSavedBarrels } from "../../barrel/util/barrelUtil";
import Barrel from "../../../common/domain/barrel/Barrel";

class JumpablesStore implements Store<Jumpable[], BarrelError> {
    public get = async (): Promise<Result<Jumpable[], BarrelError>> => {
        const results = await Promise.all(getSavedBarrels().map(this.getForBarrel));

        return {
            data: flatten(results.map(result => result.data)),
            errors: flatten(results.map(result => result.errors))
        };
    };

    public async getForBarrel(barrel: Barrel): Promise<Result<Jumpable[], BarrelError>> {
        const { id: barrelId, type: barrelType } = barrel;

        const { data: components, errors: componentErrors } =
            await new ZeplinComponentsStore(barrelId, barrelType).get();

        const errors = componentErrors ? [...componentErrors] : [];
        const items: Jumpable[] = components ?? [];

        if (barrelType === BarrelType.Project && !errors.find(error => error.id === barrelId)) {
            const { data: projectScreens, errors: screensErrors } = await new ProjectScreensStore(barrelId).get();

            if (screensErrors?.length) {
                const { message, code } = screensErrors[0];
                errors.unshift(new BarrelError(barrelType, barrelId, message, code));
            } else {
                const { screens, sections } = projectScreens!;
                items.unshift(...flatten([screens, ...sections.map(section => section.screens)]));
            }
        }

        return {
            errors,
            data: items
        };
    }

    public refresh = (): Promise<Result<Jumpable[], BarrelError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}

export type Jumpable = Screen | ZeplinComponent;
export default new JumpablesStore();
