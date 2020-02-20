import * as vscode from "vscode";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import { getConfig } from "../../config/util/configUtil";
import { isFirstOccurence } from "../../../common/general/arrayUtil";
import { isBarrelIdFormatValid } from "../util/barrelUtil";
import localization from "../../../localization";
import { createDiagnostics } from "../../../common/vscode/diagnostic/diagnosticsUtil";
import BarrelType from "../model/BarrelType";
import { Config } from "../../config/model/Config";

class BarrelDiagnosticCreator implements DiagnosticCreator {
    public create(document: vscode.TextDocument): vscode.Diagnostic[] {
        const configPath = document.uri.fsPath;
        const config = getConfig(configPath);
        return [
            ...this.createDiagnosticsOfBarrels(config, BarrelType.Project, document),
            ...this.createDiagnosticsOfBarrels(config, BarrelType.Styleguide, document)
        ];
    }

    private createDiagnosticsOfBarrels(config: Config, type: BarrelType, document: vscode.TextDocument):
        vscode.Diagnostic[] {
        return createDiagnostics(
            config.getBarrels(type).filter(barrelId => !isBarrelIdFormatValid(barrelId)).filter(isFirstOccurence),
            localization.coco.barrel.formatNotValid(type),
            document
        );
    }
}

export default new BarrelDiagnosticCreator();
