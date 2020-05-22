import Command from "../../../common/vscode/command/Command";
import { startOpenJiraLinkFlow } from "../flow/jiraFlow";

class OpenJiraLinkCommand implements Command {
    public name = "zeplin.sidebar.openJiraLink";
    public execute = startOpenJiraLinkFlow;
}

export default new OpenJiraLinkCommand();
