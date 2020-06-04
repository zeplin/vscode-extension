import * as vscode from "vscode";
import ConfigHoverCreator from "../../config/hover/ConfigHoverCreator";
import HoverBuilder from "../../../common/vscode/hover/HoverBuilder";
import ZeplinComponentStore from "../data/ZeplinComponentStore";
import localization from "../../../localization";
import { getConfig } from "../../config/util/configUtil";
import { getZeplinComponentDetailRepresentation } from "../../../common/domain/zeplinComponent/util/zeplinComponentUi";
import { boldenForMarkdown, getMarkdownCommand, escapeMarkdownChars } from "../../../common/vscode/hover/hoverUtil";
import { getComponentAppUri, getComponentWebUrl } from "../../../common/domain/openInZeplin/util/zeplinUris";
import { getOpenInZeplinLinks, getMarkdownRefreshIcon } from "../../../common/domain/hover/zeplinHoverUtil";
import { getImageSize } from "../../../common/general/imageUtil";
import ClearCacheCommand from "../../../session/command/ClearCacheCommand";

const MAX_DESCRIPTION_LENGTH = 100;
const MAX_THUMBNAIL_HEIGHT = 80;

class ZeplinComponentHoverCreator implements ConfigHoverCreator {
    public isApplicable(configPath: string, word: string): boolean {
        return getConfig(configPath).getAllZeplinComponentNames().includes(word);
    }

    public async create(configPath: string, word: string): Promise<vscode.Hover> {
        const { data, errors } = await new ZeplinComponentStore(word, configPath).get();

        if (errors?.length) {
            return new HoverBuilder()
                .append(localization.coco.zeplinComponent.notFound(escapeMarkdownChars(word)))
                .build();
        } else {
            const builder = new HoverBuilder();
            const thumbnailSizes =
                await Promise.all(data!.map(({ component }) => getImageSize(component.latestVersion.snapshot.url)));
            for (let componentIndex = 0; componentIndex < data!.length; componentIndex++) {
                const { component, providerId, providerType } = data![componentIndex];
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

            return builder.build();
        }
    }
}

export default new ZeplinComponentHoverCreator();
