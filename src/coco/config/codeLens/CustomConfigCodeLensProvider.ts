import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import CodeLensProvider from "../../../common/vscode/codeLens/CodeLensProvider";
import SetConfigCodeLensCreator from "./SetConfigCodeLensCreator";
import ConfigPaths from "../util/ConfigPaths";

class CustomConfigCodeLensProvider extends CodeLensProvider {
    public createWatcher(): vscode.Disposable {
        return vscode.workspace.onDidSaveTextDocument(document => {
            if (!ConfigPaths.include(document.uri.fsPath)) {
                this.refresh();
            }
        });
    }

    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: "**" };
    }

    protected getCodeLensCreators(): CodeLensCreator[] {
        return [
            SetConfigCodeLensCreator
        ];
    }
}

export default new CustomConfigCodeLensProvider();
