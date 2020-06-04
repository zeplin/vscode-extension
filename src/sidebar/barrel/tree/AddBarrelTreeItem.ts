import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import AddBarrelToSidebarCommand from "../command/AddBarrelToSidebarCommand";
import { getThemedIconUris } from "../../../common/general/iconPathUtil";

export default class AddBarrelTreeItem extends TreeItem {
    public iconPath = getThemedIconUris("icon-add.svg");
    public command = {
        title: localization.sidebar.barrel.addAnother,
        command: AddBarrelToSidebarCommand.name
    };

    public constructor() {
        super(localization.sidebar.barrel.addAnother, undefined);
    }
}
