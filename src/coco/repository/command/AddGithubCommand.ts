import Command from "../../../common/vscode/command/Command";
import { startAddGithubFlow } from "../flow/repositoryFlow";

class AddGithubCommand implements Command {
    public name = "zeplin.addGithub";
    public execute = startAddGithubFlow;
}

export default new AddGithubCommand();
