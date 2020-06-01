import Command from "../../../common/vscode/command/Command";
import { startAddRepositoryFlow } from "../flow/repositoryFlow";

class AddRepositoryCommand implements Command {
    public name = "zeplin.addRepository";
    public execute = startAddRepositoryFlow;
}

export default new AddRepositoryCommand();
