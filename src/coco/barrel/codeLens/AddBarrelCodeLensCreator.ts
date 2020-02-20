import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import AddProjectCommand from "../command/AddProjectCommand";
import localization from "../../../localization";
import AddStyleguideCommand from "../command/AddStyleguideCommand";
import { getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import { createCodeLenses } from "../../../common/vscode/codeLens/codeLensUtil";
import BarrelType from "../model/BarrelType";

const KEY_PROJECTS = "projects";
const KEY_STYLEGUIDES = "styleguides";

class AddBarrelCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        } else {
            const projectCodeLenses = createCodeLenses(
                getPositionsOfProperty(KEY_PROJECTS, document),
                {
                    command: AddProjectCommand.name,
                    title: localization.coco.barrel.add(BarrelType.Project)
                }
            );
            const styleguideCodeLenses = createCodeLenses(
                getPositionsOfProperty(KEY_STYLEGUIDES, document),
                {
                    command: AddStyleguideCommand.name,
                    title: localization.coco.barrel.add(BarrelType.Styleguide)
                }
            );

            return projectCodeLenses.concat(styleguideCodeLenses);
        }
    }
}

export default new AddBarrelCodeLensCreator();
