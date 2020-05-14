import ZeplinComponent from "../model/ZeplinComponent";
import localization from "../../../../localization";

const DETAIL_ITEM_SEPARATOR = " ▸ ";

function getZeplinComponentDetailRepresentation(zeplinComponent: ZeplinComponent, showLabel = false): string {
    return [
        zeplinComponent.barrelName,
        showLabel ? localization.common.zeplinComponent.zeplinComponents : undefined,
        ...zeplinComponent.sectionNames
    ]
        .filter(representation => representation)
        .join(DETAIL_ITEM_SEPARATOR);
}

export {
    getZeplinComponentDetailRepresentation
};
