import localization from "../../../localization";
import OpenExternalUrlCommand from "../../vscode/command/OpenExternalUrlCommand";
import { getMarkdownLink, getMarkdownImage } from "../../vscode/hover/hoverUtil";
import { isVscodeVersionSufficient } from "../../vscode/ide/vscodeUtil";
import ContextProvider from "../../vscode/extension/ContextProvider";

const CODICON_MIN_VERSION = "1.42";

function getOpenInZeplinLinks(appUrl: string, webUrl: string) {
    return localization.common.openInZeplin +
        getMarkdownLink(getExternalLinkViaCommand(appUrl), localization.common.app, appUrl) +
        localization.common.openInSeparator +
        getMarkdownLink(webUrl, localization.common.web);
}

function getExternalLinkViaCommand(url: string) {
    return `command:${OpenExternalUrlCommand.name}?${encodeURIComponent(JSON.stringify(url))}`;
}

function getMarkdownRefreshIcon(): string {
    return isVscodeVersionSufficient(CODICON_MIN_VERSION)
        ? "$(refresh)"
        : getMarkdownImage(`${ContextProvider.get().asAbsolutePath("resources/dark/icon-refresh.svg")}`);
}

export {
    getOpenInZeplinLinks,
    getMarkdownRefreshIcon
};
