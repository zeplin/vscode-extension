import Command from "../../../common/vscode/command/Command";
import { refreshSidebarBarrels } from "../flow/barrelFlow";

class RefreshSidebarBarrelsCommand implements Command {
    public name = "zeplin.sidebar.refreshBarrels";

    public execute() {
        refreshSidebarBarrels();
        return Promise.resolve();
    }
}

export default new RefreshSidebarBarrelsCommand();
