import Command from "../../common/vscode/command/Command";
import { tryManualLogin } from "../flow/sessionFlow";

class ManualLoginCommand implements Command {
    public name = "zeplin.manualLogin";

    public execute() {
        return tryManualLogin();
    }
}

export default new ManualLoginCommand();
