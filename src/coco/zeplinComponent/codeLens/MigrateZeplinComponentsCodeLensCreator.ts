import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import localization from "../../../localization";
import MigrateZeplinComponentsCommand from "../command/MigrateZeplinComponentsCommand";
import { containsExplicitZeplinNames } from "../util/zeplinComponentMigrationUtil";

class MigrateZeplinComponentsCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        }

        const configPath = document.uri.fsPath;
        if (!containsExplicitZeplinNames(configPath)) {
            return [];
        }

        return [new vscode.CodeLens(
            new vscode.Range(0, 0, 0, 0),
            {
                command: MigrateZeplinComponentsCommand.name,
                title: localization.coco.zeplinComponent.migrate,
                arguments: [configPath]
            }
        )];
    }
}

export default new MigrateZeplinComponentsCodeLensCreator();
