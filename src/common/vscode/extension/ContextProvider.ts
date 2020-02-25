import * as vscode from "vscode";

/**
 * Provides context to use throughout the extension.
 */
class ContextProvider {
    private context?: vscode.ExtensionContext;

    /**
     * Sets context to provide later.
     * @param context Context.
     */
    public initialize(context: vscode.ExtensionContext) {
        this.context = context;
    }

    /**
     * Returns context.
     */
    public get(): vscode.ExtensionContext {
        return this.context!;
    }
}

export default new ContextProvider();
