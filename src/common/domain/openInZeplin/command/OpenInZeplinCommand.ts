import Command from "../../../vscode/command/Command";
import { openInZeplin } from "../flow/openInZeplinFlow";

class OpenInZeplinCommand implements Command {
    public name = "zeplin.sidebar.openInZeplin";
    public execute = openInZeplin;
}

export default new OpenInZeplinCommand();
