import Command from "../../../common/vscode/command/Command";
import { startAddComponentsFlow } from "../flow/componentFlow";

class AddComponentsCommand implements Command {
    public name = "zeplin.addComponents";
    public execute = startAddComponentsFlow;
}

export default new AddComponentsCommand();
