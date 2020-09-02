import * as vscode from "vscode";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import { getConfig } from "../../config/util/configUtil";
import { createDiagnostics } from "../../../common/vscode/diagnostic/diagnosticsUtil";
import localization from "../../../localization";
import { doesComponentExist } from "../util/componentUtil";
import { isFirstOccurence } from "../../../common/general/arrayUtil";
import ConfigPaths from "../../config/util/ConfigPaths";

class ComponentDiagnosticCreator implements DiagnosticCreator {
    public create(document: vscode.TextDocument): vscode.Diagnostic[] {
        const configPath = document.uri.fsPath;
        const config = getConfig(configPath);
        const rootPath = ConfigPaths.getRootOf(configPath);
        const componentRelativePaths = config.getComponents().map(component => component.path);
        const nonExistentComponentRelativePaths = componentRelativePaths
            .filter(isFirstOccurence)
            .filter(relativePath => !doesComponentExist(rootPath, relativePath));

        return createDiagnostics(
            nonExistentComponentRelativePaths,
            localization.coco.component.componentNotFound, document
        );
    }
}

export default new ComponentDiagnosticCreator();
