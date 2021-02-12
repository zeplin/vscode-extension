import Command from "../../../common/vscode/command/Command";
import { startMigrateZeplinComponentsFlow } from "../flow/migrateZeplinComponentsFlow";

class MigrateZeplinComponentsCommand implements Command {
    public name = "zeplin.migrateZeplinComponents";
    public execute = startMigrateZeplinComponentsFlow;
}

export default new MigrateZeplinComponentsCommand();
