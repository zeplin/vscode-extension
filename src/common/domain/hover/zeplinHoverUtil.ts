import { getMarkdownImage } from "../../vscode/hover/hoverUtil";
import { isVscodeVersionSufficient, isVscodeVersionEqualTo } from "../../vscode/ide/vscodeUtil";
import { HOVER_CODICONS_MIN_VERSION, HOVER_CODICONS_BROKEN_VERSION } from "../../vscode/ide/vscodefeatureVersions";
import { IconTheme, getIconPath } from "../../general/iconPathUtil";

function getMarkdownIcon(codicon: string, imagePath: string): string {
    return isVscodeVersionSufficient(HOVER_CODICONS_MIN_VERSION) &&
        !isVscodeVersionEqualTo(HOVER_CODICONS_BROKEN_VERSION)
        ? `$(${codicon})`
        : getMarkdownImage(getIconPath(imagePath, IconTheme.Dark));
}

function getMarkdownLinkExternalIcon(): string {
    return getMarkdownIcon("link-external", "icon-link-external.svg");
}

function getMarkdownRefreshIcon(): string {
    return getMarkdownIcon("refresh", "icon-refresh.svg");
}

export {
    getMarkdownLinkExternalIcon,
    getMarkdownRefreshIcon
};
