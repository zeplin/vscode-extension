import * as vscode from "vscode";
import Command from "./Command";

class OpenExternalUrlCommand implements Command {
    public name = "openExternalUrl";

    public async execute(url?: string) {
        if (url) {
            await vscode.env.openExternal(vscode.Uri.parse(url));
        }
    }
}

export default new OpenExternalUrlCommand();
