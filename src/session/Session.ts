
import * as vscode from "vscode";
import { TokenStorage } from "./tokenStorage";
import ContextProvider from "../common/vscode/extension/ContextProvider";

const KEY_LOGGED_IN = "zeplinLoggedIn";

class Session {
    private memento?: vscode.Memento;
    private tokenStorage?: TokenStorage;

    public initialize(tokenStorage: TokenStorage) {
        this.memento = ContextProvider.get().globalState;
        this.tokenStorage = tokenStorage;
    }

    public isLoggedIn(): boolean {
        return this.memento!.get<boolean>(KEY_LOGGED_IN) ?? false;
    }

    public getToken(): Promise<string | null> {
        return this.tokenStorage!.get();
    }

    public setToken(token: string) {
        this.memento!.update(KEY_LOGGED_IN, true);
        return this.tokenStorage!.set(token);
    }

    public removeToken() {
        this.memento!.update(KEY_LOGGED_IN, false);
        return this.tokenStorage!.remove();
    }
}

export default new Session();
