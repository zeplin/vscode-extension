import * as vscode from "vscode";
import ConfigPaths from "../util/ConfigPaths";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import ClearCacheCodeLensCreator from "../../../session/codeLens/ClearCacheCodeLensCreator";
import LoginCodeLensCreator from "../../../session/codeLens/LoginCodeLensCreator";
import ConfigStatisticsCodeLensCreator from "./ConfigStatisticsCodeLensCreator";
import AddBarrelCodeLensCreator from "../../barrel/codeLens/AddBarrelCodeLensCreator";
import AddComponentsCodeLensCreator from "../../component/codeLens/AddComponentsCodeLensCreator";
import AddZeplinComponentsCodeLensCreator from "../../zeplinComponent/codeLens/AddZeplinComponentsCodeLensCreator";
import CodeLensProvider from "../../../common/vscode/codeLens/CodeLensProvider";
import SetConfigRootCodeLensCreator from "./SetConfigRootCodeLensCreator";

class ConfigCodeLensProvider extends CodeLensProvider {
    public createWatcher(): vscode.Disposable {
        return vscode.workspace.onDidSaveTextDocument(document => {
            if (ConfigPaths.include(document.uri.fsPath)) {
                this.refresh();
            }
        });
    }

    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: "**" };
    }

    protected getCodeLensCreators(document: vscode.TextDocument): CodeLensCreator[] {
        if (!ConfigPaths.include(document.uri.fsPath)) {
            return [];
        }

        return [
            LoginCodeLensCreator,
            ClearCacheCodeLensCreator,
            ConfigStatisticsCodeLensCreator,
            SetConfigRootCodeLensCreator,
            AddBarrelCodeLensCreator,
            AddComponentsCodeLensCreator,
            AddZeplinComponentsCodeLensCreator
        ];
    }
}

export default new ConfigCodeLensProvider();
