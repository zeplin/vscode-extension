
import * as vscode from "vscode";
import { TokenStorage } from "./tokenStorage";
import ContextProvider from "../common/vscode/extension/ContextProvider";
import { setContext } from "../common/vscode/ide/builtinCommands";

const STATE_KEY_LOGGED_IN = "zeplinLoggedIn";
const CONTEXT_KEY_LOGGED_IN = "zeplin:loggedIn";

/**
 * Session data storage wrapper.
 */
class Session {
    private memento?: vscode.Memento;
    private tokenStorage?: TokenStorage;

    /**
     * Initializes session data with a token storage.
     * @param tokenStorage An available token storage mechanism.
     */
    public initialize(tokenStorage: TokenStorage) {
        this.memento = ContextProvider.get().globalState;
        this.tokenStorage = tokenStorage;
        setContext(CONTEXT_KEY_LOGGED_IN, this.isLoggedIn());
    }

    /**
     * Determines whether user is logged in.
     */
    public isLoggedIn(): boolean {
        return this.memento!.get<boolean>(STATE_KEY_LOGGED_IN) ?? false;
    }

    /**
     * Returns session token.
     */
    public getToken(): Promise<string | null> {
        return this.tokenStorage!.get();
    }

    /**
     * Saves session token.
     * @param token A session token to save.
     */
    public setToken(token: string) {
        this.memento!.update(STATE_KEY_LOGGED_IN, true);
        setContext(CONTEXT_KEY_LOGGED_IN, true);
        return this.tokenStorage!.set(token);
    }

    /**
     * Removes session token.
     */
    public removeToken() {
        this.memento!.update(STATE_KEY_LOGGED_IN, false);
        setContext(CONTEXT_KEY_LOGGED_IN, false);
        return this.tokenStorage!.remove();
    }
}

export default new Session();
