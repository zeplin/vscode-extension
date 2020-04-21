import * as vscode from "vscode";

import ConfigHoverCreator from "../../../coco/config/hover/ConfigHoverCreator";
import { RELATIVE_PATH, isConfigValid } from "../../../coco/config/util/configUtil";
import BarrelHoverCreator from "../../../coco/barrel/hover/BarrelHoverCreator";
import ZeplinComponentHoverCreator from "../../../coco/zeplinComponent/hover/ZeplinComponentHoverCreator";
import { wrapWithLogs, wrapWithLogsAsync } from "../../../log/util/logUtil";
import ConfigPropertyHoverCreator from "../../domain/hover/ConfigPropertyHoverCreator";
import BarrelsPropertyHoverData from "../../../coco/barrel/hover/BarrelsPropertyHoverData";
import ComponentsPropertyHoverData from "../../../coco/component/hover/ComponentsPropertyHoverData";
import RepositoryPropertyHoverData from "../../../coco/repository/hover/RepositoryPropertyHoverData";
import PluginsPropertyHoverData from "../../../coco/plugin/hover/PluginsPropertyHoverData";
import LinksPropertyHoverData from "../../../coco/link/hover/LinksPropertyHoverData";

const DATA_BOUNDARY = '"';

/**
 * Accumulates Hover creators to provide hovers.
 */
class HoverProvider implements vscode.HoverProvider {
    /**
     * Returns a selector that defines the documents this provider is applicable to.
     */
    public getDocumentSelector(): vscode.DocumentSelector {
        return { pattern: `**/${RELATIVE_PATH}` };
    }

    /**
     * Provides a hover by accumulating Hover creators. None is returned when none of the creators create a hover.
     * @param document The document in which the command was invoked.
     * @param position The position at which the command was invoked.
     */
    public provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover> | undefined {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return;
        }

        const hoveredWord = document.getText(range);
        if (!hoveredWord.startsWith(DATA_BOUNDARY) || !hoveredWord.endsWith(DATA_BOUNDARY)) {
            return;
        }

        const configPath = document.uri.fsPath;
        if (!isConfigValid(configPath)) {
            return;
        }

        const word = hoveredWord.slice(DATA_BOUNDARY.length, -DATA_BOUNDARY.length);
        const hoverCreators: ConfigHoverCreator[] = [
            new ConfigPropertyHoverCreator(BarrelsPropertyHoverData.ForProjects),
            new ConfigPropertyHoverCreator(BarrelsPropertyHoverData.ForStyleguides),
            new ConfigPropertyHoverCreator(ComponentsPropertyHoverData),
            new ConfigPropertyHoverCreator(RepositoryPropertyHoverData.ForGithub),
            new ConfigPropertyHoverCreator(RepositoryPropertyHoverData.ForGitlab),
            new ConfigPropertyHoverCreator(RepositoryPropertyHoverData.ForBitbucket),
            new ConfigPropertyHoverCreator(PluginsPropertyHoverData),
            new ConfigPropertyHoverCreator(LinksPropertyHoverData),
            BarrelHoverCreator.ForProjects,
            BarrelHoverCreator.ForStyleguides,
            ZeplinComponentHoverCreator
        ];
        const hoverCreator = hoverCreators.find(
            creator => wrapWithLogs(
                () => creator.isApplicable(configPath, word),
                `Hover for "${word}" checking with "${creator.constructor.name}"`,
                true
            )
        );
        if (!hoverCreator) {
            return;
        }

        return wrapWithLogsAsync(
            () => hoverCreator.create(configPath, word),
            `Hover for "${word}" display with "${hoverCreator.constructor.name}"`
        );
    }
}

export default new HoverProvider();
