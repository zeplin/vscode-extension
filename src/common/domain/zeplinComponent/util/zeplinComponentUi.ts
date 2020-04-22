import ZeplinComponent from "../model/ZeplinComponent";

const DETAIL_ITEM_SEPARATOR = " ▸ ";

function getZeplinComponentDetailRepresentation(zeplinComponent: ZeplinComponent): string {
    return [
        zeplinComponent.barrelName,
        ...zeplinComponent.sectionNames
    ]
        .filter(representation => representation)
        .join(DETAIL_ITEM_SEPARATOR);
}

export {
    getZeplinComponentDetailRepresentation
};
