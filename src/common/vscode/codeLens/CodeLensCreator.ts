import * as vscode from "vscode";

export default interface CodeLensCreator {
    create(document: vscode.TextDocument): vscode.CodeLens[];
}
