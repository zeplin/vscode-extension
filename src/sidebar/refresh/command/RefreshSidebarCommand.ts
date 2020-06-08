import Command from "../../../common/vscode/command/Command";
import Refresher from "../../../session/util/Refresher";

class RefreshSidebarCommand implements Command {
    public name = "zeplin.sidebar.refresh";

    public execute() {
        Refresher.refresh();
        return Promise.resolve();
    }
}

export default new RefreshSidebarCommand();
