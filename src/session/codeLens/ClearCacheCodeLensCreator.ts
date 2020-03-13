import * as vscode from "vscode";
import CodeLensCreator from "../../common/vscode/codeLens/CodeLensCreator";
import localization from "../../localization/localization";
import ClearCacheCommand from "../command/ClearCacheCommand";
import Session from "../Session";

class ClearCacheCodeLensCreator implements CodeLensCreator {
    public create(): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            return [new vscode.CodeLens(
                new vscode.Range(0, 0, 0, 0),
                {
                    command: ClearCacheCommand.name,
                    title: localization.session.clearCache
                }
            )];
        }
    }
}

export default new ClearCacheCodeLensCreator();
