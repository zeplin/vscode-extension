import Command from "../../../common/vscode/command/Command";
import { showComponentInConfig } from "../flow/componentFlow";

class ShowComponentInConfigCommand implements Command {
    public name = "openInConfig";

    public execute(item: string) {
        showComponentInConfig(item);
        return Promise.resolve();
    }
}

export default new ShowComponentInConfigCommand();
