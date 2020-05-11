import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import JumpToSidebarItemCommand from "../command/JumpToSidebarItemCommand";

class JumpToTreeItem extends TreeItem {
    public command = {
        title: localization.sidebar.jumpTo.jumpToItem,
        command: JumpToSidebarItemCommand.name
    };

    public constructor() {
        super(localization.sidebar.jumpTo.jumpToItem, undefined);
    }
}

export default new JumpToTreeItem();
