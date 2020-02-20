import Command from "../../../common/vscode/command/Command";
import { startAddBitbucketFlow } from "../flow/repositoryFlow";

class AddBitbucketCommand implements Command {
    public name = "zeplin.addBitbucket";
    public execute = startAddBitbucketFlow;
}

export default new AddBitbucketCommand();
