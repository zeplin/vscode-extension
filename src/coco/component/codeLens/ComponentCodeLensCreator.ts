import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import * as configUtil from "../../config/util/configUtil";
import ShowComponentInConfigCommand from "../command/ShowComponentInConfigCommand";
import localization from "../../../localization";
import ConfigPaths from "../../config/util/ConfigPaths";

class ComponentCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        const filePath = document.uri.fsPath;
        if (!ConfigPaths.hasForItem(filePath) ||
            !configUtil.isConfigValid(ConfigPaths.getForItem(filePath)) ||
            !configUtil.isComponentAddedToConfig(filePath)) {
            return [];
        }

        return [new vscode.CodeLens(
            new vscode.Range(0, 0, 0, 0),
            {
                command: ShowComponentInConfigCommand.name,
                title: localization.coco.component.zeplinComponentCount(
                    configUtil.getZeplinComponentsCountOfComponent(filePath)
                ),
                arguments: [filePath]
            }
        )];
    }
}

export default new ComponentCodeLensCreator();
