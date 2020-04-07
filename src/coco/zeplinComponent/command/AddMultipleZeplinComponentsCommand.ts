import Command from "../../../common/vscode/command/Command";
import { startAddMultipleZeplinComponentsFlow } from "../flow/zeplinComponentFlow";

class AddMultipleZeplinComponentsCommand implements Command {
    public name = "zeplin.addMultipleZeplinComponents";
    public execute = startAddMultipleZeplinComponentsFlow;
}

export default new AddMultipleZeplinComponentsCommand();
