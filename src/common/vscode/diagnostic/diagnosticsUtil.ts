import * as vscode from "vscode";
import { flatten } from "../../general/arrayUtil";
import { getRangesOfProperty } from "../editor/textDocumentUtil";

/**
 * Returns Diagnostics on a text document with given properties and a message.
 * @param propertyNames Property names to search for on given text document.
 * @param message Message of diagnostics to be created.
 * @param document A text document to create diagnostics on.
 */
function createDiagnostics(propertyNames: string[], message: string, document: vscode.TextDocument):
    vscode.Diagnostic[] {
    return flatten(
        propertyNames.map(
            property => getRangesOfProperty(property, document).map(
                range => new vscode.Diagnostic(range, message)
            )
        )
    );
}

export {
    createDiagnostics
};
