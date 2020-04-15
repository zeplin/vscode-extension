import * as vscode from "vscode";
import ConfigHoverCreator from "../../config/hover/ConfigHoverCreator";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import { getBarrelDetailRepresentation } from "../util/barrelUi";
import HoverBuilder from "../../../common/vscode/hover/HoverBuilder";
import { getConfig } from "../../config/util/configUtil";
import localization from "../../../localization";
import { getBarrelAppUrl, getBarrelWebUrl } from "../../../common/domain/openInZeplin/util/zeplinUrls";
import { boldenForMarkdown, getMarkdownCommand } from "../../../common/vscode/hover/hoverUtil";
import BaseError from "../../../common/domain/error/BaseError";
import { ErrorCodes } from "../../../common/domain/error/errorUi";
import { getCroppedImageUrl } from "../../../common/domain/image/zeplinImageUtil";
import { getOpenInZeplinLinks, getMarkdownRefreshIcon } from "../../../common/domain/hover/zeplinHoverUtil";
import { isBarrelIdFormatValid } from "../../../common/domain/barrel/util/barrelUtil";
import ClearCacheCommand from "../../../session/command/ClearCacheCommand";

const MAX_THUMBNAIL_WIDTH = 270;
const MAX_THUMBNAIL_HEIGHT = 92;

class BarrelHoverCreator implements ConfigHoverCreator {
    public constructor(private barrelType: BarrelType) { }

    public isApplicable(configPath: string, barrelId: string): boolean {
        return isBarrelIdFormatValid(barrelId) && getConfig(configPath).getBarrels(this.barrelType).includes(barrelId);
    }

    public async create(configPath: string, barrelId: string): Promise<vscode.Hover> {
        const { data, errors } = await BarrelDetailsStoreProvider.get(barrelId, this.barrelType).get();

        const appUrl = getBarrelAppUrl(barrelId, this.barrelType);
        const webUrl = getBarrelWebUrl(barrelId, this.barrelType);
        if (errors && errors.length) {
            const builder = new HoverBuilder().append(this.getErrorMessage(errors[0]));
            if (errors[0].code === ErrorCodes.NotInvited) {
                builder
                    .appendLine()
                    .appendLine()
                    .append(getOpenInZeplinLinks(appUrl, webUrl));
            }
            return builder.build();
        } else {
            const { name, thumbnail } = data!;
            const thumbnailUrl = thumbnail
                ? await getCroppedImageUrl(thumbnail, MAX_THUMBNAIL_WIDTH, MAX_THUMBNAIL_HEIGHT)
                : undefined;
            const detail = getBarrelDetailRepresentation(data!);

            const builder = new HoverBuilder()
                .append(
                    `${boldenForMarkdown(name)} ${getMarkdownCommand(ClearCacheCommand.name, getMarkdownRefreshIcon())}`
                )
                .appendLine(true);
            if (thumbnailUrl) {
                builder
                    .appendImage(thumbnailUrl)
                    .appendLine();
            }
            return builder
                .append(detail)
                .appendLine()
                .appendLine()
                .append(getOpenInZeplinLinks(appUrl, webUrl))
                .build();
        }
    }

    private getErrorMessage(error: BaseError) {
        switch (error.code) {
            case ErrorCodes.Deleted:
            case ErrorCodes.Archived:
            case ErrorCodes.NotInvited:
                return error.message;
            default:
                return localization.coco.barrel.notFound(this.barrelType);
        }
    }
}

export default {
    ForProjects: new BarrelHoverCreator(BarrelType.Project),
    ForStyleguides: new BarrelHoverCreator(BarrelType.Styleguide)
};
