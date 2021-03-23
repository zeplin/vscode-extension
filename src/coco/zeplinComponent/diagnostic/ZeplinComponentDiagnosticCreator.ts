import * as vscode from "vscode";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import { getConfig } from "../../config/util/configUtil";
import { isFirstOccurence } from "../../../common/general/arrayUtil";
import ZeplinComponentStore from "../data/ZeplinComponentStore";
import { createDiagnostics } from "../../../common/vscode/diagnostic/diagnosticsUtil";
import localization from "../../../localization";
import { isZeplinComponentIdFormatValid } from "../../../common/domain/zeplinComponent/util/zeplinComponentUtil";

class ZeplinComponentDiagnosticCreator implements DiagnosticCreator {
    public async create(document: vscode.TextDocument): Promise<vscode.Diagnostic[]> {
        const configPath = document.uri.fsPath;
        const zeplinComponentDescriptors = getConfig(configPath).getAllZeplinComponentDescriptors();
        const zeplinComponentNames = zeplinComponentDescriptors.zeplinNames.filter(isFirstOccurence);
        const zeplinComponentIds = zeplinComponentDescriptors.zeplinIds.filter(isFirstOccurence);
        const validFormatZeplinComponentIds = zeplinComponentIds.filter(isZeplinComponentIdFormatValid);
        const invalidFormatZeplinComponentIds = zeplinComponentIds.filter(id => !isZeplinComponentIdFormatValid(id));

        const diagnostics = createDiagnostics(
            invalidFormatZeplinComponentIds,
            localization.coco.zeplinComponent.formatNotValid,
            document
        );

        for (const name of zeplinComponentNames) {
            const result = await ZeplinComponentStore.byName(name, configPath).get();
            if (result.errors?.length) {
                diagnostics.push(...createDiagnostics(
                    name, localization.coco.zeplinComponent.notFound(name), document, vscode.DiagnosticSeverity.Warning
                ));
            }
        }

        for (const id of validFormatZeplinComponentIds) {
            const result = await ZeplinComponentStore.byId(id, configPath).get();
            if (result.errors?.length) {
                diagnostics.push(...createDiagnostics(
                    id, localization.coco.zeplinComponent.notFound(id), document, vscode.DiagnosticSeverity.Warning
                ));
            }
        }

        return diagnostics;
    }
}

export default new ZeplinComponentDiagnosticCreator();
