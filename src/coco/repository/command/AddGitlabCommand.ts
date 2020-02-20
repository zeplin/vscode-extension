import Command from "../../../common/vscode/command/Command";
import { startAddGitlabFlow } from "../flow/repositoryFlow";

class AddGitlabCommand implements Command {
    public name = "zeplin.addGitlab";
    public execute = startAddGitlabFlow;
}

export default new AddGitlabCommand();
