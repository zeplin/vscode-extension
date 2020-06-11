import * as vscode from "vscode";
import { flatten } from "../../general/arrayUtil";
import { getRangesOfProperty } from "../editor/textDocumentUtil";

/**
 * Returns Diagnostics on a text document with given property and a message.
 * @param propertyName Property name to search for on given text document.
 * @param message Message of diagnostics to be created.
 * @param document A text document to create diagnostics on.
 * @param severity Severity of diagnostics to be created
 */
function createDiagnostics(
    propertyName: string,
    message: string,
    document: vscode.TextDocument,
    severity?: vscode.DiagnosticSeverity
): vscode.Diagnostic[];

/**
 * Returns Diagnostics on a text document with given properties and a message.
 * @param propertyNames Property names to search for on given text document.
 * @param message Message of diagnostics to be created.
 * @param document A text document to create diagnostics on.
 * @param severity Severity of diagnostics to be created
 */
function createDiagnostics(
    propertyNames: string[],
    message: string,
    document: vscode.TextDocument,
    severity?: vscode.DiagnosticSeverity
): vscode.Diagnostic[];

function createDiagnostics(
    propertyNameOrNames: string | string[],
    message: string,
    document: vscode.TextDocument,
    severity = vscode.DiagnosticSeverity.Error
): vscode.Diagnostic[] {
    const propertyNames = typeof propertyNameOrNames === "string" ? [propertyNameOrNames] : propertyNameOrNames;

    return flatten(
        propertyNames.map(
            property => getRangesOfProperty(property, document).map(
                range => new vscode.Diagnostic(range, message, severity)
            )
        )
    );
}

export {
    createDiagnostics
};
