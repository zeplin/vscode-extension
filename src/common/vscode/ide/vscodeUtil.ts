import * as vscode from "vscode";

const VERSION_SEPARATOR = ".";

function isVscodeVersionSufficient(requiredVersion: string): boolean {
    const splittedRequiredVersion = requiredVersion.split(VERSION_SEPARATOR).map(str => Number.parseInt(str, 10));
    const splittedCurrentVersion = vscode.version.split(VERSION_SEPARATOR).map(str => Number.parseInt(str, 10));

    for (let digitIndex = 0; digitIndex < splittedRequiredVersion.length; digitIndex++) {
        if (splittedCurrentVersion.length <= digitIndex) {
            return true;
        } else if (splittedCurrentVersion[digitIndex] < splittedRequiredVersion[digitIndex]) {
            return false;
        } else if (splittedCurrentVersion[digitIndex] > splittedRequiredVersion[digitIndex]) {
            return true;
        }
    }

    return splittedCurrentVersion.length >= splittedRequiredVersion.length;
}

export {
    isVscodeVersionSufficient
};
