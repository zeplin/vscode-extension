import * as vscode from "vscode";
import * as path from "path";
import ContextProvider from "../vscode/extension/ContextProvider";

const LIGHT_RESOURCES_FOLDER_PATH = "resources/light";
const DARK_RESOURCES_FOLDER_PATH = "resources/dark";

enum IconTheme {
    Light,
    Dark
}

type ThemedIconUris = {
    light: vscode.Uri;
    dark: vscode.Uri;
};

function getIconPath(fileName: string, theme: IconTheme): string {
    const folderPath = theme === IconTheme.Light ? LIGHT_RESOURCES_FOLDER_PATH : DARK_RESOURCES_FOLDER_PATH;

    return ContextProvider.get().asAbsolutePath(path.join(folderPath, fileName));
}

function getIconUri(fileName: string, theme: IconTheme): vscode.Uri {
    return vscode.Uri.file(getIconPath(fileName, theme));
}

function getThemedIconUris(fileName: string): ThemedIconUris {
    return {
        light: getIconUri(fileName, IconTheme.Light),
        dark: getIconUri(fileName, IconTheme.Dark)
    };
}

export {
    IconTheme,
    getIconPath,
    getIconUri,
    getThemedIconUris
};
