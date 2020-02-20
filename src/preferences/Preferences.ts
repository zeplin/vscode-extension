import * as vscode from "vscode";
import ContextProvider from "../common/vscode/extension/ContextProvider";
import { EXTENSION_NAME } from "../common/vscode/extension/extensionUtil";
import { normalizePaths } from "../common/general/pathUtil";

class PreferenceHolder<T> {
    private value: T | undefined;

    public constructor(public key: string, private filter: (value: unknown) => T) { }

    public get(): T {
        return this.value ??
            (this.value = this.filter(vscode.workspace.getConfiguration(EXTENSION_NAME).get(this.key)));
    }

    public clear() {
        this.value = undefined;
    }
}

function initialize() {
    ContextProvider.get().subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(EXTENSION_NAME)) {
                Object.values(Preferences).forEach(item => {
                    if (item instanceof PreferenceHolder) {
                        item.clear();
                    }
                });
            }
        })
    );
}

const Preferences = {
    IgnoredComponentExtensions: new PreferenceHolder("connectedComponents.ignoredExtensions", normalizePaths),
    IgnoredComponentFiles: new PreferenceHolder("connectedComponents.ignoredFiles", normalizePaths),
    IgnoredComponentPathsStartWith: new PreferenceHolder("connectedComponents.ignoredPathsStartWith", normalizePaths),
    IgnoredComponentPathsInclude: new PreferenceHolder("connectedComponents.ignoredPathsInclude", normalizePaths),
    initialize
};

export default Preferences;
