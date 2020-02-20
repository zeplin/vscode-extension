import localization from "../../../localization";
import OpenExternalUrlCommand from "../../vscode/command/OpenExternalUrlCommand";
import { getMarkdownLink } from "../../vscode/hover/hoverUtil";

function getOpenInZeplinLinks(appUrl: string, webUrl: string) {
    return localization.common.openInZeplin +
        getMarkdownLink(getExternalLinkViaCommand(appUrl), localization.common.app, appUrl) +
        localization.common.openInSeparator +
        getMarkdownLink(webUrl, localization.common.web);
}

function getExternalLinkViaCommand(url: string) {
    return `command:${OpenExternalUrlCommand.name}?${encodeURIComponent(JSON.stringify(url))}`;
}

export {
    getOpenInZeplinLinks
};
