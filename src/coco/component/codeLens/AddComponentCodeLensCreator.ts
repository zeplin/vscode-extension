import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import { getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import AddComponentCommand from "../command/AddComponentCommand";
import localization from "../../../localization";
import { createCodeLenses } from "../../../common/vscode/codeLens/codeLensUtil";

const KEY_COMPONENTS = "components";

class AddComponentCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            const projectCodeLenses = createCodeLenses(
                getPositionsOfProperty(KEY_COMPONENTS, document),
                {
                    command: AddComponentCommand.name,
                    title: localization.coco.component.add
                }
            );

            return projectCodeLenses;
        }
    }
}

export default new AddComponentCodeLensCreator();
