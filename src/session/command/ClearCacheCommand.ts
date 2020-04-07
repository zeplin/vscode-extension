import Command from "../../common/vscode/command/Command";
import { clearCacheAndNotify } from "../flow/sessionFlow";

class ClearCacheCommand implements Command {
    public name = "zeplin.clearCache";

    public execute() {
        clearCacheAndNotify();
        return Promise.resolve();
    }
}

export default new ClearCacheCommand();
