import Command from "../../../common/vscode/command/Command";
import { startAddProjectFlow } from "../flow/barrelFlow";

class AddProjectCommand implements Command {
    public name = "zeplin.addProject";
    public execute = startAddProjectFlow;
}

export default new AddProjectCommand();
