import * as vscode from "vscode";
import ConfigHoverCreator from "../../config/hover/ConfigHoverCreator";
import HoverBuilder from "../../../common/vscode/hover/HoverBuilder";
import ZeplinComponentStore from "../data/ZeplinComponentStore";
import localization from "../../../localization";
import { getConfig } from "../../config/util/configUtil";
import { getZeplinComponentDetailRepresentation } from "../util/zeplinComponentUi";
import { boldenForMarkdown, getMarkdownCommand } from "../../../common/vscode/hover/hoverUtil";
import { getComponentAppUrl, getComponentWebUrl } from "../../../common/domain/uri/zeplinUrls";
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

        if (errors && errors.length) {
            return new HoverBuilder().append(localization.coco.zeplinComponent.notFound(word)).build();
        } else {
            const { component, providerId, providerType } = data!;
            const thumbnailUrl = component.latestVersion.snapshot.url;
            const thumbnailSize = await getImageSize(thumbnailUrl);
            const description = component.description && component.description.length > MAX_DESCRIPTION_LENGTH
                ? `${component.description.substring(0, MAX_DESCRIPTION_LENGTH)}…`
                : component.description;
            const appUrl = getComponentAppUrl(providerId, providerType, component._id);
            const webUrl = getComponentWebUrl(providerId, providerType, component._id);

            const builder = new HoverBuilder()
                .append(
                    `${boldenForMarkdown(component.name)} ` +
                    `${getMarkdownCommand(ClearCacheCommand.name, getMarkdownRefreshIcon())}`
                )
                .appendLine(true)
                .appendImage(thumbnailUrl, thumbnailSize.width, thumbnailSize.height, undefined, MAX_THUMBNAIL_HEIGHT)
                .appendLine();
            if (description) {
                builder
                    .append(description)
                    .appendLine(true);
            }
            return builder.append(getZeplinComponentDetailRepresentation(component))
                .appendLine()
                .appendLine()
                .append(getOpenInZeplinLinks(appUrl, webUrl))
                .build();
        }
    }
}

export default new ZeplinComponentHoverCreator();
