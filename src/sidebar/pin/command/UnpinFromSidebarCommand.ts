import Command from "../../../common/vscode/command/Command";
import { unpinItem } from "../flow/pinFlow";
import TreeItem from "../../../common/vscode/tree/TreeItem";

class UnpinFromSidebarCommand implements Command {
    public name = "zeplin.sidebar.unpinItem";

    public execute(item: TreeItem) {
        unpinItem(item);
        return Promise.resolve();
    }
}

export default new UnpinFromSidebarCommand();
