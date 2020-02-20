import * as vscode from "vscode";
import Store from "../../../common/domain/store/Store";
import { getAllComponentPaths } from "../../config/util/configUtil";
import Result from "../../../common/domain/store/Result";
import Preferences from "../../../preferences/Preferences";
import { getRootFolderCount, getRelativePathToRootFolder } from "../../../common/vscode/workspace/workspaceUtil";
import ComponentPath from "../model/ComponentPath";
import { PATH_SEPARATOR, EXTENSION_SEPARATOR } from "../../../common/general/pathUtil";

const REGEX_ANY = "**";

class ComponentPathStore implements Store<ComponentPath[]> {
    public get = async (): Promise<Result<ComponentPath[]>> => {
        const multipleRootFolders = getRootFolderCount() > 1;
        const alreadyAddedComponentPaths = getAllComponentPaths();
        const filePaths = (await vscode.workspace.findFiles(REGEX_ANY))
            .map(uri => uri.fsPath)
            .filter(path => !alreadyAddedComponentPaths.includes(path))
            .filter(this.isAllowed);

        const componentPaths = filePaths.map(filePath => ({
            relative: getRelativePathToRootFolder(filePath, multipleRootFolders),
            fs: filePath
        }) as ComponentPath);

        return {
            data: componentPaths
        };
    };

    public refresh = this.get;

    private isAllowed(path: string) {
        const lowercaseRelativePath = getRelativePathToRootFolder(path).toLowerCase();
        const possibleExtensionDividerPosition = lowercaseRelativePath.lastIndexOf(EXTENSION_SEPARATOR);
        const fileNameDividerPosition = lowercaseRelativePath.lastIndexOf(PATH_SEPARATOR);
        const hasExtension = fileNameDividerPosition < possibleExtensionDividerPosition;
        const extension = !hasExtension ? null : lowercaseRelativePath.substring(possibleExtensionDividerPosition + 1);
        return hasExtension &&
            !Preferences.IgnoredComponentExtensions.get().includes(extension!) &&
            !Preferences.IgnoredComponentFiles.get().some(text => lowercaseRelativePath === text) &&
            !Preferences.IgnoredComponentPathsStartWith.get().some(text => lowercaseRelativePath.startsWith(text)) &&
            !Preferences.IgnoredComponentPathsInclude.get().some(text => lowercaseRelativePath.includes(text));
    }
}

export default new ComponentPathStore();
