import * as vscode from "vscode";
import ConfigHoverCreator from "../../config/hover/ConfigHoverCreator";
import HoverBuilder from "../../../common/vscode/hover/HoverBuilder";
import ZeplinComponentStore from "../data/ZeplinComponentStore";
import { getConfig } from "../../config/util/configUtil";
import { getZeplinComponentDetailRepresentation } from "../../../common/domain/zeplinComponent/util/zeplinComponentUi";
import { boldenForMarkdown, getMarkdownCommand } from "../../../common/vscode/hover/hoverUtil";
import { getComponentAppUri, getComponentWebUrl } from "../../../common/domain/openInZeplin/util/zeplinUris";
import { getOpenInZeplinLinks, getMarkdownRefreshIcon } from "../../../common/domain/hover/zeplinHoverUtil";
import { getImageSize } from "../../../common/general/imageUtil";
import ClearCacheCommand from "../../../session/command/ClearCacheCommand";
import localization from "../../../localization";

const MAX_DESCRIPTION_LENGTH = 100;
const MAX_THUMBNAIL_HEIGHT = 80;
const MAX_ELEMENTS_TO_DISPLAY = 5;

class ZeplinComponentHoverCreator implements ConfigHoverCreator {
    public isApplicable(configPath: string, word: string): boolean {
        return getConfig(configPath).getAllZeplinComponentNames().includes(word);
    }

    public async create(configPath: string, word: string): Promise<vscode.Hover> {
        const { data, errors } = await new ZeplinComponentStore(word, configPath).get();

        const builder = new HoverBuilder();

        if (!errors?.length) {
            const allComponents = data!;
            const componentsToDisplay = allComponents.slice(0, MAX_ELEMENTS_TO_DISPLAY);
            const thumbnailSizes = await Promise.all(
                componentsToDisplay.map(({ component }) => getImageSize(component.latestVersion.snapshot.url))
            );
            for (let componentIndex = 0; componentIndex < componentsToDisplay.length; componentIndex++) {
                const { component, providerId, providerType } = componentsToDisplay[componentIndex];
                const thumbnailUrl = component.latestVersion.snapshot.url;
                const thumbnailSize = thumbnailSizes[componentIndex];
                const description = component.description && component.description.length > MAX_DESCRIPTION_LENGTH
                    ? `${component.description.substring(0, MAX_DESCRIPTION_LENGTH)}…`
                    : component.description;
                const appUri = getComponentAppUri(providerId, providerType, component._id);
                const webUrl = getComponentWebUrl(providerId, providerType, component._id);

                if (componentIndex !== 0) {
                    builder.appendLine().appendHorizontalLine().appendLine();
                }
                builder
                    .append(
                        `${boldenForMarkdown(component.name)} ` +
                        `${getMarkdownCommand(ClearCacheCommand.name, getMarkdownRefreshIcon())}`
                    )
                    .appendLine(true)
                    .appendImage(
                        thumbnailUrl, thumbnailSize.width, thumbnailSize.height, undefined, MAX_THUMBNAIL_HEIGHT
                    )
                    .appendLine();
                if (description) {
                    builder
                        .append(description)
                        .appendLine(true);
                }
                builder.append(getZeplinComponentDetailRepresentation(component))
                    .appendLine()
                    .appendLine()
                    .append(getOpenInZeplinLinks(appUri, webUrl));
            }

            if (allComponents.length > MAX_ELEMENTS_TO_DISPLAY) {
                builder
                    .appendLine()
                    .appendHorizontalLine()
                    .appendLine()
                    .append(localization.coco.zeplinComponent.moreItems(allComponents.length - MAX_ELEMENTS_TO_DISPLAY))
                    .appendLine();
            }
        }

        return builder.build();
    }
}

export default new ZeplinComponentHoverCreator();
