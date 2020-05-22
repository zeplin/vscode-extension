import * as vscode from "vscode";

const COMMAND_NAME_SET_CONTEXT = "setContext";

function setContext(key: string, value: unknown) {
    vscode.commands.executeCommand(COMMAND_NAME_SET_CONTEXT, key, value);
}

export {
    setContext
};
