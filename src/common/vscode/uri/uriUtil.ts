import * as vscode from "vscode";

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
