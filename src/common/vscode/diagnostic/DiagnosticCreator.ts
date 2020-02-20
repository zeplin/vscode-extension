import * as vscode from "vscode";

export default interface DiagnosticCreator {
    create(document: vscode.TextDocument): vscode.Diagnostic[];
}
