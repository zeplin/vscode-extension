import Command from "../../../common/vscode/command/Command";
import { startPinScreenFlow } from "../flow/pinFlow";

class PinScreenToSidebarCommand implements Command {
    public name = "zeplin.sidebar.pinScreen";
    public execute = startPinScreenFlow;
}

export default new PinScreenToSidebarCommand();
