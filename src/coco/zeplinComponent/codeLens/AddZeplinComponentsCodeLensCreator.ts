import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import { getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import AddZeplinComponentsCommand from "../command/AddZeplinComponentsCommand";
import localization from "../../../localization";
import { createCodeLens } from "../../../common/vscode/codeLens/codeLensUtil";

const KEY_ZEPLIN_NAMES = "zeplinNames";

class AddZeplinComponentsCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            const zeplinComponentCodeLenses = getPositionsOfProperty(KEY_ZEPLIN_NAMES, document).map(
                (position, index) => createCodeLens(position, {
                    command: AddZeplinComponentsCommand.name,
                    title: localization.coco.zeplinComponent.connect,
                    arguments: [index]
                })
            );

            return zeplinComponentCodeLenses;
        }
    }
}

export default new AddZeplinComponentsCodeLensCreator();
