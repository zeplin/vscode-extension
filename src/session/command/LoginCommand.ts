import Command from "../../common/vscode/command/Command";
import { tryLogin } from "../flow/sessionFlow";

class LoginCommand implements Command {
    public name = "zeplin.login";

    public execute() {
        tryLogin();
        return Promise.resolve();
    }
}

export default new LoginCommand();
