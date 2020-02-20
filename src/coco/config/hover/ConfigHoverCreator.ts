import * as vscode from "vscode";

export default interface ConfigHoverCreator {
    isApplicable(configPath: string, word: string): boolean;
    create(configPath: string, word: string): Promise<vscode.Hover>;
}
