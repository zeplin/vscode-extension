import * as vscode from "vscode";
import Command from "../command/Command";
import { wrapWithLogsAsync } from "../../../log/util/logUtil";
import ContextProvider from "./ContextProvider";

const EXTENSION_PUBLISHER = "Zeplin";
const EXTENSION_NAME = "zeplin";
const EXTENSION_IDENTIFIER = `${EXTENSION_PUBLISHER}.${EXTENSION_NAME}`;
const KEY_INITIALIZED = "initialized";

function getExtensionVersion(): string {
    return vscode.extensions.getExtension(EXTENSION_IDENTIFIER)!.packageJSON.version;
}

function isInitialized(): boolean {
    return ContextProvider.get().workspaceState.get(KEY_INITIALIZED) ?? false;
}

function initialized() {
    return ContextProvider.get().workspaceState.update(KEY_INITIALIZED, true);
}

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
