import Command from "../../../common/vscode/command/Command";
import { removeBarrel } from "../util/barrelUtil";
import { BarrelTreeItem } from "../tree/BarrelTreeItem";

class RemoveBarrelFromSidebarCommand implements Command {
    public name = "zeplin.sidebar.removeBarrel";

    public execute(item: BarrelTreeItem) {
        removeBarrel(item.barrel);
        return Promise.resolve();
    }
}

export default new RemoveBarrelFromSidebarCommand();
