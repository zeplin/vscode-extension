import ZeplinComponentSection from "../model/ZeplinComponentSection";
import ZeplinComponent from "../model/ZeplinComponent";
import BarrelDetailsResponse from "../model/BarrelDetailsResponse";

function getComponentsFromSections(barrel: BarrelDetailsResponse): ZeplinComponent[] {
    return getComponentsFromSectionsAdditive(
        barrel.name,
        barrel.componentSections.map(section => ({
            section,
            breadcrumbs: []
        } as SectionWithBreadcrumbs)),
        true, // Default section is always the first section
        []
    );
}

function getComponentsFromSectionsAdditive(
    barrelName: string,
    sectionWithBreadcrumbsArray: SectionWithBreadcrumbs[],
    defaultSection: boolean,
    accumulator: ZeplinComponent[]
): ZeplinComponent[] {
    if (sectionWithBreadcrumbsArray && sectionWithBreadcrumbsArray.length) {
        const { section, breadcrumbs } = sectionWithBreadcrumbsArray.shift()!;

        accumulator.push(
            ...section.components.map(
                component => ({
                    _id: component._id,
                    description: component.description,
                    name: component.name,
                    latestVersion: component.latestVersion,
                    barrelName,
                    sectionNames: defaultSection ? breadcrumbs : breadcrumbs.concat(section.name)
                    // Section name is not shown for default section
                } as ZeplinComponent)
            )
        );

        if (section.componentSections) {
            sectionWithBreadcrumbsArray.unshift(
                ...section.componentSections.map(
                    subsection => ({
                        section: subsection,
                        breadcrumbs: breadcrumbs.concat(section.name)
                    } as SectionWithBreadcrumbs)
                )
            );
        }

        return getComponentsFromSectionsAdditive(barrelName, sectionWithBreadcrumbsArray, false, accumulator);
    }

    return accumulator;
}

interface SectionWithBreadcrumbs {
    section: ZeplinComponentSection;
    breadcrumbs: string[];
}

export {
    getComponentsFromSections
};
