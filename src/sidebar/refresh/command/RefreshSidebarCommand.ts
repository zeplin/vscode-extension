import Command from "../../../common/vscode/command/Command";
import { refreshSidebar } from "../util/refreshUtil";

class RefreshSidebarCommand implements Command {
    public name = "zeplin.sidebar.refresh";

    public execute() {
        refreshSidebar();
        return Promise.resolve();
    }
}

export default new RefreshSidebarCommand();
