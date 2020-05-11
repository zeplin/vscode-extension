import ZeplinComponentSection from "../../../common/domain/zeplinComponent/model/ZeplinComponentSection";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import BarrelDetailsResponse from "../../../common/domain/barrel/model/BarrelDetailsResponse";

function getComponentsFromSections(barrel: BarrelDetailsResponse): ZeplinComponent[] {
    return getComponentsFromSectionsAdditive(
        barrel._id,
        barrel.name,
        barrel.componentSections.map(section => ({
            section,
            nameBreadcrumbs: [],
            idBreadcrumbs: []
        } as SectionWithBreadcrumbs)),
        true, // Default section is always the first section
        []
    );
}

function getComponentsFromSectionsAdditive( // eslint-disable-line max-params
    barrelId: string,
    barrelName: string,
    sectionWithBreadcrumbsArray: SectionWithBreadcrumbs[],
    defaultSection: boolean,
    accumulator: ZeplinComponent[]
): ZeplinComponent[] {
    if (sectionWithBreadcrumbsArray && sectionWithBreadcrumbsArray.length) {
        const { section, nameBreadcrumbs, idBreadcrumbs } = sectionWithBreadcrumbsArray.shift()!;

        accumulator.push(
            ...section.components.map(
                component => ({
                    _id: component._id,
                    description: component.description,
                    name: component.name,
                    latestVersion: component.latestVersion,
                    barrelId,
                    barrelName,
                    sectionIds: defaultSection ? idBreadcrumbs : idBreadcrumbs.concat(section._id),
                    sectionNames: defaultSection ? nameBreadcrumbs : nameBreadcrumbs.concat(section.name)
                    // Default section components are regarded as sectionless
                } as ZeplinComponent)
            )
        );

        if (section.componentSections) {
            sectionWithBreadcrumbsArray.unshift(
                ...section.componentSections.map(
                    subsection => ({
                        section: subsection,
                        idBreadcrumbs: idBreadcrumbs.concat(section._id),
                        nameBreadcrumbs: nameBreadcrumbs.concat(section.name)
                    } as SectionWithBreadcrumbs)
                )
            );
        }

        return getComponentsFromSectionsAdditive(barrelId, barrelName, sectionWithBreadcrumbsArray, false, accumulator);
    }

    return accumulator;
}

interface SectionWithBreadcrumbs {
    section: ZeplinComponentSection;
    nameBreadcrumbs: string[];
    idBreadcrumbs: string[];
}

export {
    getComponentsFromSections
};
