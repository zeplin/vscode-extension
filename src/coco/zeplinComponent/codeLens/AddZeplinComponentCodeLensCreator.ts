import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import { getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import AddZeplinComponentCommand from "../command/AddZeplinComponentCommand";
import localization from "../../../localization";
import { createCodeLens } from "../../../common/vscode/codeLens/codeLensUtil";

const KEY_ZEPLIN_NAMES = "zeplinNames";

class AddZeplinComponentCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            const projectCodeLenses = getPositionsOfProperty(KEY_ZEPLIN_NAMES, document).map(
                (position, index) => createCodeLens(position, {
                    command: AddZeplinComponentCommand.name,
                    title: localization.coco.zeplinComponent.connect,
                    arguments: [index]
                })
            );

            return projectCodeLenses;
        }
    }
}

export default new AddZeplinComponentCodeLensCreator();
