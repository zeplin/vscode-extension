import Command from "../../../common/vscode/command/Command";
import { startSetConfigRootFlow } from "../flow/configFlow";

class SetConfigRootCommand implements Command {
    public name = "zeplin.setConfigRoot";
    public execute = startSetConfigRootFlow;
}

export default new SetConfigRootCommand();
