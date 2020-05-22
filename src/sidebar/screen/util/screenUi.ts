import Screen from "../model/Screen";
import localization from "../../../localization";

const DETAIL_ITEM_SEPARATOR = " ▸ ";

function getScreenDetailRepresentation(screen: Screen): string {
    return [screen.barrelName, localization.sidebar.screen.screens, screen.sectionName]
        .filter(representation => representation)
        .join(DETAIL_ITEM_SEPARATOR);
}

export {
    getScreenDetailRepresentation
};
