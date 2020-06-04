import Command from "../../../common/vscode/command/Command";
import { startAddZeplinComponentsFlow } from "../flow/zeplinComponentFlow";

class AddZeplinComponentsCommand implements Command {
    public name = "zeplin.addZeplinComponents";
    public execute = startAddZeplinComponentsFlow;
}

export default new AddZeplinComponentsCommand();
