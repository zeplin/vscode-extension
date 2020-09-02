import Command from "../../../common/vscode/command/Command";
import { startSetConfigFlow } from "../flow/configFlow";

class SetConfigCommand implements Command {
    public name = "zeplin.setConfig";
    public execute = startSetConfigFlow;
}

export default new SetConfigCommand();
