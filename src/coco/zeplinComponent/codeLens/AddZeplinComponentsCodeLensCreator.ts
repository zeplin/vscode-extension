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
const KEY_ZEPLIN_IDS = "zeplinIds";

type CodeLensOptions = {
    position: vscode.Position;
    preferIds: boolean;
    index: number;
};

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
        // Remove "path"s which are before "components"
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
        const zeplinIdsPositions = getPositionsOfProperty(KEY_ZEPLIN_IDS, document);
        const zeplinNamesCodeLensOptions =
            this.createCodeLensOptions(zeplinNamesPositions, pathPositions, false, componentCount);
        const zeplinIdsCodeLensOptions =
            this.createCodeLensOptions(zeplinIdsPositions, pathPositions, true, componentCount);
        const zeplinComponentDescriptorsCodeLensOptions = [...zeplinNamesCodeLensOptions, ...zeplinIdsCodeLensOptions];

        const zeplinComponentCodeLenses = zeplinComponentDescriptorsCodeLensOptions
            .map(({ position, index, preferIds }) => createCodeLens(position, {
                command: AddZeplinComponentsCommand.name,
                title: localization.coco.zeplinComponent.connect,
                arguments: [index, preferIds]
            }));

        return zeplinComponentCodeLenses;
    }

    private createCodeLensOptions(
        positions: vscode.Position[],
        pathPositions: vscode.Position[],
        preferIds: boolean,
        componentCount: number
    ): CodeLensOptions[] {
        return positions
            .map(position => ({
                position,
                preferIds,
                // This is the index of the "path" which current "zeplinIds" or "zeplinNames" corresponds to.
                // As "path" is mandatory, it gives the correct index to new component to.
                index: pathPositions.findIndex(pathPosition => pathPosition.isAfter(position)) - 1
            }))
            .filter(({ index }) => index >= 0 && index < componentCount);
    }
}

export default new AddZeplinComponentsCodeLensCreator();
