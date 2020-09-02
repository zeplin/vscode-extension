import Command from "../../../common/vscode/command/Command";
import { startUnsetConfigFlow } from "../flow/configFlow";

class UnsetConfigCommand implements Command {
    public name = "zeplin.unsetConfig";
    public execute = startUnsetConfigFlow;
}

export default new UnsetConfigCommand();
