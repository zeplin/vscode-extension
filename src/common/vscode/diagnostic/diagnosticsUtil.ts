import * as vscode from "vscode";
import { flatten } from "../../general/arrayUtil";
import { getRangesOfProperty } from "../editor/textDocumentUtil";

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
