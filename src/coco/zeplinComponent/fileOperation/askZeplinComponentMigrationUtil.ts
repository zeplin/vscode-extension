import * as vscode from "vscode";
import ConfigPaths from "../../config/util/ConfigPaths";
import { askZeplinComponentMigrationIfNeeded } from "../flow/migrateZeplinComponentsFlow";

function askZeplinComponentMigrationOnConfigOpen(document: vscode.TextDocument) {
    const filePath = document.uri.fsPath;
    if (ConfigPaths.include(filePath)) {
        askZeplinComponentMigrationIfNeeded(filePath, false);
    }
}

export {
    askZeplinComponentMigrationOnConfigOpen
};
