import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import { getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import AddMultipleZeplinComponentsCommand from "../command/AddMultipleZeplinComponentsCommand";
import localization from "../../../localization";
import { createCodeLens } from "../../../common/vscode/codeLens/codeLensUtil";

const KEY_ZEPLIN_NAMES = "zeplinNames";

class AddMultipleZeplinComponentsCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            const zeplinComponentCodeLenses = getPositionsOfProperty(KEY_ZEPLIN_NAMES, document).map(
                (position, index) => createCodeLens(position, {
                    command: AddMultipleZeplinComponentsCommand.name,
                    title: localization.coco.zeplinComponent.connectMultiple,
                    arguments: [index]
                })
            );

            return zeplinComponentCodeLenses;
        }
    }
}

export default new AddMultipleZeplinComponentsCodeLensCreator();
