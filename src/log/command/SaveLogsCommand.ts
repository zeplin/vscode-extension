import Command from "../../common/vscode/command/Command";
import Logger from "../Logger";

class SaveLogsCommand implements Command {
    public name = "zeplin.saveLogs";

    public execute() {
        Logger.saveToFile();
        return Promise.resolve();
    }
}

export default new SaveLogsCommand();
