import Command from "../../../common/vscode/command/Command";
import { startAddProjectToSidebarFlow } from "../flow/barrelFlow";

class AddProjectToSidebarCommand implements Command {
    public name = "zeplin.sidebar.addProject";
    public execute = startAddProjectToSidebarFlow;
}

export default new AddProjectToSidebarCommand();
