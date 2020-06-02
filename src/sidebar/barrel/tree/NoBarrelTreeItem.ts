import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import { getThemedIconUris } from "../../../common/general/iconPathUtil";

export default class NoBarrelTreeItem extends TreeItem {
    public iconPath = getThemedIconUris("icon-info.svg");

    public constructor() {
        super(localization.sidebar.barrel.emptyInfo, undefined);
    }
}
