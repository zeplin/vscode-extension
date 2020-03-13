import * as vscode from "vscode";

/**
 * Returns a Code Lens with a position and a command.
 * @param position A position to create Code Lens on.
 * @param command A command to assign to Code Lens.
 */
function createCodeLens(position: vscode.Position, command: vscode.Command): vscode.CodeLens {
    return new vscode.CodeLens(new vscode.Range(position, position), command);
}

/**
 * Returns Code Lenses with given positions and a command.
 * @param positions Positions to create Code Lenses on.
 * @param command A command to assign to Code Lenses.
 */
function createCodeLenses(positions: vscode.Position[], command: vscode.Command): vscode.CodeLens[] {
    return positions.map(position => createCodeLens(position, command));
}

export {
    createCodeLens,
    createCodeLenses
};
