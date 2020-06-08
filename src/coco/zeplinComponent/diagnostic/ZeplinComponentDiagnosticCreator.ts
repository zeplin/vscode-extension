import * as vscode from "vscode";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import { getConfig } from "../../config/util/configUtil";
import { isFirstOccurence } from "../../../common/general/arrayUtil";
import ZeplinComponentStore from "../data/ZeplinComponentStore";
import { createDiagnostics } from "../../../common/vscode/diagnostic/diagnosticsUtil";
import localization from "../../../localization";

class ZeplinComponentDiagnosticCreator implements DiagnosticCreator {
    public async create(document: vscode.TextDocument): Promise<vscode.Diagnostic[]> {
        const configPath = document.uri.fsPath;
        const zeplinComponentNames = getConfig(configPath).getAllZeplinComponentNames().filter(isFirstOccurence);
        const diagnostics = [];
        for (const name of zeplinComponentNames) {
            const result = await new ZeplinComponentStore(name, configPath).get();
            if (result.errors?.length) {
                diagnostics.push(...createDiagnostics(
                    name, localization.coco.zeplinComponent.notFound(name), document, vscode.DiagnosticSeverity.Warning
                ));
            }
        }
        return diagnostics;
    }
}

export default new ZeplinComponentDiagnosticCreator();
