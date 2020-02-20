import Command from "../../../common/vscode/command/Command";
import { startAddPluginFlow } from "../flow/pluginFlow";

class AddPluginCommand implements Command {
    public name = "zeplin.addPlugin";
    public execute = startAddPluginFlow;
}

export default new AddPluginCommand();
