import Command from "../../../common/vscode/command/Command";
import { startAddMultipleComponentsFlow } from "../flow/componentFlow";

class AddMultipleComponentsCommand implements Command {
    public name = "zeplin.addMultipleComponents";
    public execute = startAddMultipleComponentsFlow;
}

export default new AddMultipleComponentsCommand();
