import * as vscode from "vscode";
import Command from "../command/Command";
import { wrapWithLogsAsync } from "../../../log/util/logUtil";
import ContextProvider from "./ContextProvider";

/**
 * Name of the publisher.
 */
const EXTENSION_PUBLISHER = "Zeplin";
/**
 * Name of this extension.
 */
const EXTENSION_NAME = "zeplin";
/**
 * Id of this extension.
 */
const EXTENSION_IDENTIFIER = `${EXTENSION_PUBLISHER}.${EXTENSION_NAME}`;
const KEY_INITIALIZED = "initialized";

/**
 * Returns version of this extension.
 */
function getExtensionVersion(): string {
    return vscode.extensions.getExtension(EXTENSION_IDENTIFIER)!.packageJSON.version;
}

/**
 * Checks whether this extension is initialized.
 */
function isInitialized(): boolean {
    return ContextProvider.get().globalState.get(KEY_INITIALIZED) ?? false;
}

/**
 * Sets this extension is initialized.
 */
function initialized() {
    return ContextProvider.get().globalState.update(KEY_INITIALIZED, true);
}

/**
 * Registers command with wrapping with logs.
 * @param command Command
 */
function registerCommand(command: Command) {
    ContextProvider.get().subscriptions.push(
        vscode.commands.registerCommand(
            command.name,
            (...args) => wrapWithLogsAsync(
                () => command.execute(...args),
                `Command "${command.name}"`
            )
        )
    );
}

export {
    EXTENSION_NAME,
    getExtensionVersion,
    isInitialized as isExtensionInitialized,
    initialized as extensionInitialized,
    registerCommand
};
