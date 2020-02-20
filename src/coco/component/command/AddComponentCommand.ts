import Command from "../../../common/vscode/command/Command";
import { startAddComponentFlow } from "../flow/componentFlow";

class AddComponentCommand implements Command {
    public name = "zeplin.addComponent";
    public execute = startAddComponentFlow;
}

export default new AddComponentCommand();
