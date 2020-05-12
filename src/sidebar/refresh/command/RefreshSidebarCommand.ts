import Command from "../../../common/vscode/command/Command";
import SidebarRefresher from "../util/SidebarRefresher";

class RefreshSidebarCommand implements Command {
    public name = "zeplin.sidebar.refresh";

    public execute() {
        SidebarRefresher.refresh();
        return Promise.resolve();
    }
}

export default new RefreshSidebarCommand();
