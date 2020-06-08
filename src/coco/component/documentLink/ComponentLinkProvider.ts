import * as vscode from "vscode";
import * as path from "path";
import { getConfig, RELATIVE_PATH, isConfigValid } from "../../config/util/configUtil";
import { isFirstOccurence, flatten } from "../../../common/general/arrayUtil";
import { toProperty, getRangesOf } from "../../../common/vscode/editor/textDocumentUtil";
import { getRootFolderPathForFile } from "../../../common/vscode/workspace/workspaceUtil";
import localization from "../../../localization";
import { doesComponentExist } from "../util/componentUtil";
import { wrapWithLogs } from "../../../log/util/logUtil";

class ComponentLinkProvider implements vscode.DocumentLinkProvider {
    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: `**/${RELATIVE_PATH}` };
    }

    public provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
        return wrapWithLogs(
            () => {
                if (!isConfigValid(document.uri.fsPath)) {
                    return [];
                }

                const configPath = document.uri.fsPath;
                const rootPath = getRootFolderPathForFile(configPath);
                const componentRelativePaths = getConfig(configPath)
                    .getComponents()
                    .map(component => component.path)
                    .filter(relativePath => doesComponentExist(rootPath, relativePath))
                    .filter(isFirstOccurence);
                const links =
                    componentRelativePaths.map(relativePath => this.getLinksForRelativePath(relativePath, document));
                return flatten(links);
            },
            ComponentLinkProvider.name,
            true
        );
    }

    private getLinksForRelativePath(relativePath: string, document: vscode.TextDocument): vscode.DocumentLink[] {
        const searchText = toProperty(relativePath);
        return getRangesOf(searchText, document).map(
            range => ({
                range,
                target: vscode.Uri.file(path.join(getRootFolderPathForFile(document.uri.fsPath), relativePath)),
                tooltip: localization.coco.component.goToFile
            })
        );
    }
}

export default new ComponentLinkProvider();
