import * as vscode from "vscode";
import * as path from "path";
import { getConfig, isConfigValid } from "../../config/util/configUtil";
import { isFirstOccurence, flatten } from "../../../common/general/arrayUtil";
import { toProperty, getRangesOf } from "../../../common/vscode/editor/textDocumentUtil";
import localization from "../../../localization";
import { doesComponentExist } from "../util/componentUtil";
import { wrapWithLogs } from "../../../log/util/logUtil";
import ConfigPaths from "../../config/util/ConfigPaths";

class ComponentLinkProvider implements vscode.DocumentLinkProvider {
    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: "**" };
    }

    public provideDocumentLinks(document: vscode.TextDocument): vscode.DocumentLink[] {
        return wrapWithLogs(
            () => {
                const configPath = document.uri.fsPath;
                if (ConfigPaths.include(configPath) && !isConfigValid(configPath)) {
                    return [];
                }

                const rootPath = ConfigPaths.getRootOf(configPath);
                const componentRelativePaths = getConfig(configPath)
                    .getComponents()
                    .map(component => component.path)
                    .filter(relativePath => doesComponentExist(rootPath, relativePath))
                    .filter(isFirstOccurence);
                const links = componentRelativePaths
                    .map(relativePath => this.getLinksForRelativePath(relativePath, rootPath, document));
                return flatten(links);
            },
            ComponentLinkProvider.name,
            true
        );
    }

    private getLinksForRelativePath(relativePath: string, rootPath: string, document: vscode.TextDocument):
        vscode.DocumentLink[] {
        const searchText = toProperty(relativePath);
        return getRangesOf(searchText, document).map(
            range => ({
                range,
                target: vscode.Uri.file(path.join(rootPath, relativePath)),
                tooltip: localization.coco.component.goToFile
            })
        );
    }
}

export default new ComponentLinkProvider();
