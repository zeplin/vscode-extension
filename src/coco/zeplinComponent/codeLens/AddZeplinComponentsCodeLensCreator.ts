import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import Session from "../../../session/Session";
import { getPositionOfProperty, getPositionsOfProperty } from "../../../common/vscode/editor/textDocumentUtil";
import AddZeplinComponentsCommand from "../command/AddZeplinComponentsCommand";
import localization from "../../../localization";
import { createCodeLens } from "../../../common/vscode/codeLens/codeLensUtil";
import { getConfig } from "../../config/util/configUtil";

const KEY_COMPONENTS = "components";
const KEY_PATH = "path";
const KEY_ZEPLIN_NAMES = "zeplinNames";

class AddZeplinComponentsCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (!Session.isLoggedIn()) {
            return [];
        }

        const componentsPosition = getPositionOfProperty(KEY_COMPONENTS, document);
        if (!componentsPosition) {
            return [];
        }

        const pathPositions = getPositionsOfProperty(KEY_PATH, document);
        while (pathPositions.length && pathPositions[0].isBefore(componentsPosition)) {
            pathPositions.shift();
        }

        if (!pathPositions.length) {
            return [];
        }

        const configPath = document.uri.fsPath;
        const config = getConfig(configPath);
        const componentCount = config.getComponents().length;
        const zeplinNamesPositions = getPositionsOfProperty(KEY_ZEPLIN_NAMES, document);
        const zeplinNamesPositionsWithIndices = zeplinNamesPositions
            .map(position => ({
                position,
                index: pathPositions.findIndex(pathPosition => pathPosition.isAfter(position)) - 1
            }))
            .filter(({ index }) => index >= 0 && index < componentCount);

        const zeplinComponentCodeLenses = zeplinNamesPositionsWithIndices.map(
            ({ position, index }) => createCodeLens(position, {
                command: AddZeplinComponentsCommand.name,
                title: localization.coco.zeplinComponent.connect,
                arguments: [index]
            })
        );

        return zeplinComponentCodeLenses;
    }
}

export default new AddZeplinComponentsCodeLensCreator();
