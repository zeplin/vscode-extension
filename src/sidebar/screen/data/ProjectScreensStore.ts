import Store from "../../../common/domain/store/Store";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import ScreensStoreProvider from "./ScreensStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ResponseScreenSection from "../../../common/domain/screen/model/ResponseScreenSection";
import Screen from "../model/Screen";
import ProjectScreens from "../model/ProjectScreens";
import ResponseScreen from "../model/ResponseScreen";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";

export default class ProjectScreensStore implements Store<ProjectScreens> {
    public constructor(private projectId: string) { }

    public get = async (): Promise<Result<ProjectScreens>> => {
        const [
            { data: barrel, errors: barrelErrors },
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
            const [defaultSection, ...sections] = barrel!.screenSections!;
            const { ofScreenSections: screenSectionJiras } = barrel!.itemJiras;

            return {
                data: {
                    screens: this.getSectionScreens(defaultSection, screens!, barrel!, true),
                    sections: sections.map(section => ({
                        id: section._id,
                        name: section.name,
                        description: section.description,
                        screens: this.getSectionScreens(section, screens!, barrel!, false),
                        jiras: screenSectionJiras.filter(jira => jira.itemId === section._id)
                    }))
                }
            };
        }
    };

    private getSectionScreens(
        section: ResponseScreenSection, screens: ResponseScreen[], barrel: BarrelDetails, defaultSection: boolean
    ): Screen[] {
        const { id: barrelId, name: barrelName, itemJiras: { ofScreens: jiras } } = barrel;

        return section.screens
            .map(screenId => screens.findIndex(screen => screen._id === screenId))
            .filter(index => index >= 0)
            .map(index => screens[index])
            .map(screen => ({
                _id: screen._id,
                description: screen.description,
                name: screen.name,
                barrelId,
                barrelName,
                sectionId: defaultSection ? undefined : section._id,
                sectionName: defaultSection ? undefined : section.name,
                // Default section screens are regarded as sectionless
                latestVersion: screen.latestVersion,
                jiras: jiras.filter(jira => jira.itemId === screen._id)
            }) as Screen);
    }

    public refresh = (): Promise<Result<ProjectScreens>> => {
        BarrelDetailsStoreProvider.clearCache();
        ScreensStoreProvider.clearCache();
        return this.get();
    };
}
