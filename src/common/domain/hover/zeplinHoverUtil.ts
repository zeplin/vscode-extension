import localization from "../../../localization";
import OpenExternalUriCommand from "../../vscode/command/OpenExternalUriCommand";
import { getMarkdownLink, getMarkdownImage } from "../../vscode/hover/hoverUtil";
import { isVscodeVersionSufficient } from "../../vscode/ide/vscodeUtil";
import { HOVER_CODICONS_MIN_VERSION } from "../../vscode/ide/vscodefeatureVersions";
import { IconTheme, getIconPath } from "../../general/iconPathUtil";

function getOpenInZeplinLinks(appUri: string, webUrl: string) {
    return localization.common.openInZeplin +
        getMarkdownLink(getExternalLinkViaCommand(appUri), localization.common.app, appUri) +
        localization.common.openInSeparator +
        getMarkdownLink(webUrl, localization.common.web);
}

function getExternalLinkViaCommand(uri: string) {
    return `command:${OpenExternalUriCommand.name}?${encodeURIComponent(JSON.stringify(uri))}`;
}

function getMarkdownLinkExternalIcon(): string {
    return isVscodeVersionSufficient(HOVER_CODICONS_MIN_VERSION)
        ? "$(link-external)"
        : getMarkdownImage(getIconPath("icon-link-external.svg", IconTheme.Dark));
}

function getMarkdownRefreshIcon(): string {
    return isVscodeVersionSufficient(HOVER_CODICONS_MIN_VERSION)
        ? "$(refresh)"
        : getMarkdownImage(getIconPath("icon-refresh.svg", IconTheme.Dark));
}

export {
    getOpenInZeplinLinks,
    getMarkdownLinkExternalIcon,
    getMarkdownRefreshIcon
};
