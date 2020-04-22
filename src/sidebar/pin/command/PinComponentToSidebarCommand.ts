import Command from "../../../common/vscode/command/Command";
import { startPinComponentFlow } from "../flow/pinFlow";

class PinComponentToSidebarCommand implements Command {
    public name = "zeplin.sidebar.pinComponent";
    public execute = startPinComponentFlow;
}

export default new PinComponentToSidebarCommand();
