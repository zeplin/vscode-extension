import Command from "../../../common/vscode/command/Command";
import { pinItem } from "../flow/pinFlow";
import TreeItem from "../../../common/vscode/tree/TreeItem";

class PinToSidebarCommand implements Command {
    public name = "zeplin.sidebar.pinItem";

    public execute(item: TreeItem) {
        pinItem(item);
        return Promise.resolve();
    }
}

export default new PinToSidebarCommand();
