import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "./ScreensStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ResponseScreenSection from "../../../common/domain/screen/model/ResponseScreenSection";
import Screen from "../model/Screen";
import ProjectScreens from "../model/ProjectScreens";
import Jira from "../../../common/domain/jira/model/Jira";
import ResponseScreen from "../model/ResponseScreen";

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
            const [defaultSection, ...sections] = barrelDetails!.screenSections!;
            const { ofScreenSections: screenSectionJiras, ofScreens: screenJiras } = barrelDetails!.itemJiras;

            return {
                data: {
                    screens: this.getSectionScreens(defaultSection, screens!, screenJiras),
                    sections: sections.map(section => ({
                        id: section._id,
                        name: section.name,
                        description: section.description,
                        screens: this.getSectionScreens(section, screens!, screenJiras),
                        jiras: screenSectionJiras.filter(jira => jira.itemId === section._id)
                    }))
                }
            };
        }
    };

    private getSectionScreens(section: ResponseScreenSection, screens: ResponseScreen[], jiras: Jira[]): Screen[] {
        return section.screens
            .map(screenId => screens.findIndex(screen => screen._id === screenId))
            .filter(index => index >= 0)
            .map(index => screens[index])
            .map(screen => ({
                _id: screen._id,
                description: screen.description,
                name: screen.name,
                latestVersion: screen.latestVersion,
                jiras: jiras.filter(jira => jira.itemId === screen._id)
            }));
    }

    public refresh = (): Promise<Result<ProjectScreens>> => {
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        return this.get();
    };
}
