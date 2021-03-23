import * as path from "path";
import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import localization from "../../../localization";
import SetConfigRootCommand from "../command/SetConfigRootCommand";
import CustomConfigs from "../util/CustomConfigs";
import ConfigPaths from "../util/ConfigPaths";
import { getRelativePathToRootFolder } from "../../../common/vscode/workspace/workspaceUtil";

class SetConfigRootCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        const filePath = document.uri.fsPath;
        if (!CustomConfigs.include(filePath)) {
            return [];
        }

        const rootPath = ConfigPaths.getRootOf(filePath);
        const relativeRootPath = getRelativePathToRootFolder(rootPath);
        return [new vscode.CodeLens(
            new vscode.Range(0, 0, 0, 0),
            {
                command: SetConfigRootCommand.name,
                title: localization.coco.config.custom.currentRoot(path.join(".", relativeRootPath)),
                arguments: [filePath]
            }
        )];
    }
}

export default new SetConfigRootCodeLensCreator();
