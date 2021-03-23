import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import localization from "../../../localization";
import SetConfigCommand from "../command/SetConfigCommand";
import ConfigPaths from "../util/ConfigPaths";
import { isConfigValid } from "../util/configUtil";

class SetConfigCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        const filePath = document.uri.fsPath;
        if (ConfigPaths.include(filePath) || document.isDirty || !isConfigValid(filePath)) {
            return [];
        }

        return [new vscode.CodeLens(
            new vscode.Range(0, 0, 0, 0),
            {
                command: SetConfigCommand.name,
                title: localization.coco.config.custom.setConfig,
                arguments: [filePath]
            }
        )];
    }
}

export default new SetConfigCodeLensCreator();
