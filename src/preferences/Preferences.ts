import * as vscode from "vscode";
import ContextProvider from "../common/vscode/extension/ContextProvider";
import { EXTENSION_NAME } from "../common/vscode/extension/extensionUtil";
import { normalizePaths } from "../common/general/pathUtil";
import { filterPreferredAppType } from "../common/domain/openInZeplin/util/openInZeplinUtil";

/**
 * Preference holder with lazy loading.
 */
class PreferenceHolder<T> {
    private value: T | undefined;

    /**
     * Constructor for PreferenceHolder.
     * @param key A preference key.
     * @param filter A function for filtering user input
     */
    public constructor(public key: string, private filter: (value: unknown) => T) { }

    /**
     * Returns preference value with lazy loading.
     */
    public get(): T {
        return this.value ??
            (this.value = this.filter(vscode.workspace.getConfiguration(EXTENSION_NAME).get(this.key)));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public update(value: any, target: vscode.ConfigurationTarget.Global) {
        return vscode.workspace.getConfiguration(EXTENSION_NAME).update(this.key, value, target);
    }

    /**
     * Clears preference data
     */
    public clear() {
        this.value = undefined;
    }
}

/**
 * Subscribes to configuration changes for loading preferences once when used until they change.
 */
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

/**
 * All preference holders and initialize method for preferences.
 */
const Preferences = {
    IgnoredComponentExtensions: new PreferenceHolder("connectedComponents.ignoredExtensions", normalizePaths),
    IgnoredComponentFiles: new PreferenceHolder("connectedComponents.ignoredFiles", normalizePaths),
    IgnoredComponentPathsStartWith: new PreferenceHolder("connectedComponents.ignoredPathsStartWith", normalizePaths),
    IgnoredComponentPathsInclude: new PreferenceHolder("connectedComponents.ignoredPathsInclude", normalizePaths),
    PreferredApplicationType: new PreferenceHolder("preferredApplicationType", filterPreferredAppType),
    initialize
};

export default Preferences;
