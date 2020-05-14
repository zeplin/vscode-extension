import Command from "../../../common/vscode/command/Command";
import { startAddBarrelToSidebarFlowWithTypeSelection } from "../flow/barrelFlow";

class AddBarrelToSidebarCommand implements Command {
    public name = "zeplin.sidebar.addBarrel";
    public execute = startAddBarrelToSidebarFlowWithTypeSelection;
}

export default new AddBarrelToSidebarCommand();
