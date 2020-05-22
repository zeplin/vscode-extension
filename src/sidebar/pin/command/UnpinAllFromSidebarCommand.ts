import Command from "../../../common/vscode/command/Command";
import { askUnpinAll } from "../flow/pinFlow";

class UnpinAllFromSidebarCommand implements Command {
    public name = "zeplin.sidebar.unpinAll";

    public execute() {
        askUnpinAll();
        return Promise.resolve();
    }
}

export default new UnpinAllFromSidebarCommand();
