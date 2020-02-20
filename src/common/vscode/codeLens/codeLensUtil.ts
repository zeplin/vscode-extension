import * as vscode from "vscode";

function createCodeLens(position: vscode.Position, command: vscode.Command): vscode.CodeLens {
    return new vscode.CodeLens(new vscode.Range(position, position), command);
}

function createCodeLenses(positions: vscode.Position[], command: vscode.Command): vscode.CodeLens[] {
    return positions.map(position => createCodeLens(position, command));
}

export {
    createCodeLens,
    createCodeLenses
};
