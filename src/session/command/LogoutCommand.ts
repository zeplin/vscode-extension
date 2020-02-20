import Command from "../../common/vscode/command/Command";
import { tryLogout } from "../flow/sessionFlow";

class LogoutCommand implements Command {
    public name = "zeplin.logout";

    public execute() {
        tryLogout();
        return Promise.resolve();
    }
}

export default new LogoutCommand();
