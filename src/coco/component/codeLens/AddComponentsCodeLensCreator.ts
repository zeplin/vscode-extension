import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import { getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import AddComponentsCommand from "../command/AddComponentsCommand";
import localization from "../../../localization";
import { createCodeLenses } from "../../../common/vscode/codeLens/codeLensUtil";

const KEY_COMPONENTS = "components";

class AddComponentsCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            const codeLenses = createCodeLenses(
                getPositionsOfProperty(KEY_COMPONENTS, document),
                {
                    command: AddComponentsCommand.name,
                    title: localization.coco.component.addMultiple
                }
            );

            return codeLenses;
        }
    }
}

export default new AddComponentsCodeLensCreator();
