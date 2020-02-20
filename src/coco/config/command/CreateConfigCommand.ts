import Command from "../../../common/vscode/command/Command";
import { tryCreateConfig } from "../flow/configFlow";

class CreateConfigCommand implements Command {
    public name = "zeplin.createConfig";
    public execute = tryCreateConfig;
}

export default new CreateConfigCommand();
