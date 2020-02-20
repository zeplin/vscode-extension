import Command from "../../../common/vscode/command/Command";
import { startAddLinkFlow } from "../flow/linkFlow";

class AddLinkCommand implements Command {
    public name = "zeplin.addLink";
    public execute = startAddLinkFlow;
}

export default new AddLinkCommand();
