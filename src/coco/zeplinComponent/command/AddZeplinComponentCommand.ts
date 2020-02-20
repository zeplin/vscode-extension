import Command from "../../../common/vscode/command/Command";
import { startAddZeplinComponentFlow } from "../flow/zeplinComponentFlow";

class AddZeplinComponentCommand implements Command {
    public name = "zeplin.addZeplinComponent";
    public execute = startAddZeplinComponentFlow;
}

export default new AddZeplinComponentCommand();
