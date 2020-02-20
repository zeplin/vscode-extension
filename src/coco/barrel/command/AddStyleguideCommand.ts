import Command from "../../../common/vscode/command/Command";
import { startAddStyleguideFlow } from "../flow/barrelFlow";

class AddStyleguideCommand implements Command {
    public name = "zeplin.addStyleguide";
    public execute = startAddStyleguideFlow;
}

export default new AddStyleguideCommand();
