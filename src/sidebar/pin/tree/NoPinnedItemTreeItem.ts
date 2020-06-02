import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import { getThemedIconUris } from "../../../common/general/iconPathUtil";

export default class NoPinnedItemTreeItem extends TreeItem {
    public iconPath = getThemedIconUris("icon-pinned.svg");

    public constructor() {
        super(localization.sidebar.pin.emptyInfo, undefined);
    }
}
