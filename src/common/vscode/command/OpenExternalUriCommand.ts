import * as vscode from "vscode";
import Command from "./Command";

/**
 * Command to open an external link.
 */
class OpenExternalUriCommand implements Command {
    public name = "openExternalUri";

    public async execute(uri?: string) {
        if (uri) {
            await vscode.env.openExternal(vscode.Uri.parse(uri));
        }
    }
}

export default new OpenExternalUriCommand();
