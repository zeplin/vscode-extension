import Screen from "../model/Screen";
import Barrel from "../../../common/domain/barrel/Barrel";
import localization from "../../../localization";

const DETAIL_ITEM_SEPARATOR = " ▸ ";

function getScreenDetailRepresentation(screen: Screen, barrel: Barrel): string {
    return [barrel.name, localization.sidebar.screen.screens, screen.sectionName]
        .filter(representation => representation)
        .join(DETAIL_ITEM_SEPARATOR);
}

export {
    getScreenDetailRepresentation
};
