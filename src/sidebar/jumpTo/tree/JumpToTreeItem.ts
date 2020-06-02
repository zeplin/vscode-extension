import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import JumpToSidebarItemCommand from "../command/JumpToSidebarItemCommand";
import { getThemedIconUris } from "../../../common/general/iconPathUtil";

export default class JumpToTreeItem extends TreeItem {
    public iconPath = getThemedIconUris("icon-search.svg");
    public command = {
        title: localization.sidebar.jumpTo.jumpToItem,
        command: JumpToSidebarItemCommand.name
    };

    public constructor() {
        super(localization.sidebar.jumpTo.jumpToItem, undefined);
    }
}
