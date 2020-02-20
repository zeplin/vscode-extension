import * as vscode from "vscode";
import CodeLensCreator from "../../common/vscode/codeLens/CodeLensCreator";
import Session from "../Session";
import LoginCommand from "../command/LoginCommand";
import localization from "../../localization/localization";

class LoginCodeLensCreator implements CodeLensCreator {
    public create(): vscode.CodeLens[] {
        if (Session.isLoggedIn()) {
            return [];
        } else {
            return [new vscode.CodeLens(
                new vscode.Range(0, 0, 0, 0),
                {
                    command: LoginCommand.name,
                    title: localization.session.loginToZeplin
                }
            )];
        }
    }
}

export default new LoginCodeLensCreator();
