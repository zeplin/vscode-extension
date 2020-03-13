import * as vscode from "vscode";

/**
 * A diagnostic creator to provide to Diagnostic providers.
 */
export default interface DiagnosticCreator {
    /**
     * Creates diagnostics on a text document.
     * @param document A text document to create diagnostics on.
     */
    create(document: vscode.TextDocument): vscode.Diagnostic[];
}
