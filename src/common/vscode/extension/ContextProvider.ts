import * as vscode from "vscode";

class ContextProvider {
    private context?: vscode.ExtensionContext;

    public initialize(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public get(): vscode.ExtensionContext {
        return this.context!;
    }
}

export default new ContextProvider();
