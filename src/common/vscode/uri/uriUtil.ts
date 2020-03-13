import * as vscode from "vscode";

/**
 * Determines whether a text is a URI.
 * @param text A text to be checked.
 */
function isUri(text: string): boolean {
    try {
        vscode.Uri.parse(text, true);
        return true;
    } catch (exception) {
        return false;
    }
}

export {
    isUri
};
