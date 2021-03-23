import * as vscode from "vscode";
import CodeLensCreator from "../../../common/vscode/codeLens/CodeLensCreator";
import { getConfig, isConfigValid } from "../util/configUtil";
import { isFileDirty } from "../../../common/vscode/editor/textDocumentUtil";
import localization from "../../../localization";

class ConfigStatisticsCodeLensCreator implements CodeLensCreator {
    public create(document: vscode.TextDocument): vscode.CodeLens[] {
        if (isFileDirty(document.uri.fsPath)) {
            return [this.getLens(localization.coco.config.info.dirty)];
        }

        if (!isConfigValid(document.uri.fsPath)) {
            return [this.getLens(localization.coco.config.info.notValid)];
        }

        const config = getConfig(document.uri.fsPath);
        const projects = config.getProjects();
        const styleguides = config.getStyleguides();
        const components = config.getComponents();
        const zeplinComponents = config.getAllZeplinComponentNames();
        return [
            this.getLens(localization.coco.config.info.projectCount(projects.length)),
            this.getLens(localization.coco.config.info.styleguideCount(styleguides.length)),
            this.getLens(localization.coco.config.info.componentCount(components.length)),
            this.getLens(localization.coco.config.info.zeplinComponentCount(zeplinComponents.length))
        ];
    }

    private getLens(title: string): vscode.CodeLens {
        return new vscode.CodeLens(
            new vscode.Range(0, 0, 0, 0),
            {
                command: "",
                title
            }
        );
    }
}

export default new ConfigStatisticsCodeLensCreator();
