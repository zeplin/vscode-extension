import * as vscode from "vscode";

/**
 * A Code Lens creator to provide to CodeLensProvider.
 */
export default interface CodeLensCreator {
    /**
     * Creates Code Lens on a text document.
     * @param document A text document to create Code Lens on.
     */
    create(document: vscode.TextDocument): vscode.CodeLens[];
}
