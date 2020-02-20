import Command from "../../../common/vscode/command/Command";
import { tryOpenConfig } from "../flow/configFlow";

class OpenConfigCommand implements Command {
    public name = "zeplin.openConfig";
    public execute = tryOpenConfig;
}

export default new OpenConfigCommand();
