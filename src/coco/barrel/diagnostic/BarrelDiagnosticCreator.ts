import * as vscode from "vscode";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import { getConfig } from "../../config/util/configUtil";
import { isFirstOccurence, flatten } from "../../../common/general/arrayUtil";
import { isBarrelIdFormatValid } from "../../../common/domain/barrel/util/barrelUtil";
import localization from "../../../localization";
import { createDiagnostics } from "../../../common/vscode/diagnostic/diagnosticsUtil";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import { Config } from "../../config/model/Config";
import ConfigBarrelsStore from "../../zeplinComponent/data/ConfigBarrelsStore";

class BarrelDiagnosticCreator implements DiagnosticCreator {
    public async create(document: vscode.TextDocument): Promise<vscode.Diagnostic[]> {
        const configPath = document.uri.fsPath;
        const config = getConfig(configPath);
        const invalidFormatBarrelDiagnostics = [
            ...this.createInvalidFormatBarrelDiagnostics(config, BarrelType.Project, document),
            ...this.createInvalidFormatBarrelDiagnostics(config, BarrelType.Styleguide, document)
        ];

        const validFormatBarrelErrors = (await new ConfigBarrelsStore(configPath).get()).errors ?? [];
        const validFormatBarrelDiagnostics = flatten(validFormatBarrelErrors.map(
            ({ id, message }) => createDiagnostics(id, message, document, vscode.DiagnosticSeverity.Warning)
        ));

        return [...invalidFormatBarrelDiagnostics, ...validFormatBarrelDiagnostics];
    }

    private createInvalidFormatBarrelDiagnostics(config: Config, type: BarrelType, document: vscode.TextDocument):
        vscode.Diagnostic[] {
        return createDiagnostics(
            config.getBarrels(type).filter(barrelId => !isBarrelIdFormatValid(barrelId)).filter(isFirstOccurence),
            localization.coco.barrel.formatNotValid(type),
            document
        );
    }
}

export default new BarrelDiagnosticCreator();
