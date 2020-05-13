import localization from "../../../localization";
import OpenExternalUriCommand from "../../vscode/command/OpenExternalUriCommand";
import { getMarkdownLink, getMarkdownImage } from "../../vscode/hover/hoverUtil";
import { isVscodeVersionSufficient } from "../../vscode/ide/vscodeUtil";
import ContextProvider from "../../vscode/extension/ContextProvider";

const CODICON_MIN_VERSION = "1.42";

function getOpenInZeplinLinks(appUri: string, webUrl: string) {
    return localization.common.openInZeplin +
        getMarkdownLink(getExternalLinkViaCommand(appUri), localization.common.app, appUri) +
        localization.common.openInSeparator +
        getMarkdownLink(webUrl, localization.common.web);
}

function getExternalLinkViaCommand(uri: string) {
    return `command:${OpenExternalUriCommand.name}?${encodeURIComponent(JSON.stringify(uri))}`;
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
