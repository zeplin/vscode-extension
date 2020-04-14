import Command from "../../../common/vscode/command/Command";
import { startAddStyleguideToSidebarFlow } from "../flow/barrelFlow";

class AddStyleguideToSidebarCommand implements Command {
    public name = "zeplin.sidebar.addStyleguide";
    public execute = startAddStyleguideToSidebarFlow;
}

export default new AddStyleguideToSidebarCommand();
