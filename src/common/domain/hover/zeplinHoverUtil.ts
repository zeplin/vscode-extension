import { getMarkdownImage } from "../../vscode/hover/hoverUtil";
import { isVscodeVersionSufficient } from "../../vscode/ide/vscodeUtil";
import { HOVER_CODICONS_MIN_VERSION } from "../../vscode/ide/vscodefeatureVersions";
import { IconTheme, getIconPath } from "../../general/iconPathUtil";

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
    getMarkdownLinkExternalIcon,
    getMarkdownRefreshIcon
};
