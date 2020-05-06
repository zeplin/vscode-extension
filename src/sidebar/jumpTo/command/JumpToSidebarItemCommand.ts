import Command from "../../../common/vscode/command/Command";
import { startJumpToFlow } from "../flow/jumpToFlow";

class JumpToSidebarItemCommand implements Command {
    public name = "zeplin.sidebar.jumpTo";
    public execute = startJumpToFlow;
}

export default new JumpToSidebarItemCommand();
