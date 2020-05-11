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

export type Jumpable = Screen | ZeplinComponent;

export default class JumpablesStore implements Store<Jumpable[], BarrelError> {
    public constructor(private barrelId: string, private barrelType: BarrelType) { }

    public get = async (): Promise<Result<Jumpable[], BarrelError>> => {
        const { data: components, errors: componentErrors } =
            await new ZeplinComponentsStore(this.barrelId, this.barrelType).get();

        const errors = componentErrors ? [...componentErrors] : [];
        const items: Jumpable[] = components ?? [];

        if (this.barrelType === BarrelType.Project && !errors.find(error => error.id === this.barrelId)) {
            const { data: projectScreens, errors: screensErrors } = await new ProjectScreensStore(this.barrelId).get();

            if (screensErrors?.length) {
                const { message, code } = screensErrors[0];
                errors.unshift(new BarrelError(this.barrelType, this.barrelId, message, code));
            } else {
                const { screens, sections } = projectScreens!;
                items.unshift(...flatten([screens, ...sections.map(section => section.screens)]));
            }
        }

        return {
            errors,
            data: items
        };
    };

    public refresh = (): Promise<Result<Jumpable[], BarrelError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
