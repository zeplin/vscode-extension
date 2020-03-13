import * as vscode from "vscode";
import { TokenStorage } from ".";
import ContextProvider from "../../common/vscode/extension/ContextProvider";

const KEY_TOKEN = "zeplinToken";

/**
 * VS Code storage for session token.
 */
export default class VscodeTokenStorage implements TokenStorage {
    private readonly memento: vscode.Memento;

    public constructor() {
        this.memento = ContextProvider.get().globalState;
    }

    public get(): Promise<string | null> {
        return new Promise(resolve => resolve(this.memento.get(KEY_TOKEN)));
    }

    public set(token: string): Promise<void> {
        return new Promise(resolve => resolve(this.memento.update(KEY_TOKEN, token)));
    }

    public remove(): Promise<void> {
        return new Promise(resolve => resolve(this.memento.update(KEY_TOKEN, null)));
    }
}
