import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import CodeLensProvider from "../../../common/vscode/codeLens/CodeLensProvider";
import ComponentCodeLensCreator from "./ComponentCodeLensCreator";

class ComponentCodeLensProvider extends CodeLensProvider {
    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: `**` };
    }

    protected getCodeLensCreators(): CodeLensCreator[] {
        return [
            ComponentCodeLensCreator
        ];
    }
}

export default new ComponentCodeLensProvider();
