import * as vscode from "vscode";
import { RELATIVE_PATH, isConfigPath } from "../util/configUtil";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import ClearCacheCodeLensCreator from "../../../session/codeLens/ClearCacheCodeLensCreator";
import LoginCodeLensCreator from "../../../session/codeLens/LoginCodeLensCreator";
import ConfigStatisticsCodeLensCreator from "./ConfigStatisticsCodeLensCreator";
import AddBarrelCodeLensCreator from "../../barrel/codeLens/AddBarrelCodeLensCreator";
import AddComponentCodeLensCreator from "../../component/codeLens/AddComponentCodeLensCreator";
import AddMultipleComponentsCodeLensCreator from "../../component/codeLens/AddMultipleComponentsCodeLensCreator";
import AddZeplinComponentCodeLensCreator from "../../zeplinComponent/codeLens/AddZeplinComponentCodeLensCreator";
import CodeLensProvider from "../../../common/vscode/codeLens/CodeLensProvider";

class ConfigCodeLensProvider extends CodeLensProvider {
    public createWatcher(): vscode.Disposable {
        return vscode.workspace.onDidSaveTextDocument(document => {
            if (isConfigPath(document.uri.fsPath)) {
                this.refresh();
            }
        });
    }

    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: `**/${RELATIVE_PATH}` };
    }

    protected getCodeLensCreators(): CodeLensCreator[] {
        return [
            LoginCodeLensCreator,
            ClearCacheCodeLensCreator,
            ConfigStatisticsCodeLensCreator,
            AddBarrelCodeLensCreator,
            AddComponentCodeLensCreator,
            AddMultipleComponentsCodeLensCreator,
            AddZeplinComponentCodeLensCreator
        ];
    }
}

export default new ConfigCodeLensProvider();
