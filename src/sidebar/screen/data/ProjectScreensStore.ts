import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "./ScreensStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ResponseScreenSection from "../model/ResponseScreenSection";
import Screen from "../model/Screen";
import ProjectScreens from "../model/ProjectScreens";

export default class ProjectScreensStore implements Store<ProjectScreens> {
    public constructor(private projectId: string) { }

    public get = async (): Promise<Result<ProjectScreens>> => {
        const [
            { data: barrelDetails, errors: barrelErrors },
            { data: screens, errors: screensErrors }
        ] = await Promise.all([
            BarrelDetailsStoreProvider.get(this.projectId, BarrelType.Project).get(),
            ScreensStoreProvider.get(this.projectId).get()
        ]);

        if (barrelErrors || screensErrors) {
            return {
                errors: barrelErrors ?? screensErrors
            };
        } else {
            const [
                defaultSection,
                ...sections
            ] = barrelDetails!.screenSections!;

            return {
                data: {
                    screens: this.getSectionScreens(defaultSection, screens!),
                    sections: sections.map(section => ({
                        id: section._id,
                        name: section.name,
                        description: section.description,
                        screens: this.getSectionScreens(section, screens!)
                    }))
                }
            };
        }
    };

    private getSectionScreens(section: ResponseScreenSection, screens: Screen[]): Screen[] {
        return section.screens
            .map(screenId => screens.findIndex(screen => screen._id === screenId))
            .filter(index => index >= 0)
            .map(index => screens[index]);
    }

    public refresh = (): Promise<Result<ProjectScreens>> => {
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        return this.get();
    };
}
