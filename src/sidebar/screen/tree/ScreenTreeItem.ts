import * as vscode from "vscode";
import Screen from "../model/Screen";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import Barrel from "../../../common/domain/barrel/Barrel";
import { isScreenPinned } from "../../pin/util/pinUtil";
import ZeplinUriProvider from "../../openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { getScreenUri } from "../../../common/domain/openInZeplin/util/zeplinUris";

function getContextProvider(screen: Screen): TreeItemContextProvider {
    const contexts = [
        TreeItemContext.Screen,
        TreeItemContext.ZeplinLink,
        isScreenPinned(screen) ? TreeItemContext.Pinned : TreeItemContext.Pinnable
    ];
    if (screen.jiras.length) {
        contexts.push(TreeItemContext.Jira);
    }
    return new TreeItemContextProvider(...contexts);
}

export default class ScreenTreeItem extends TreeItem implements ZeplinUriProvider {
    public iconPath = vscode.Uri.parse(this.screen.latestVersion.snapshot.url, true);

    public constructor(public screen: Screen, public project: Barrel, parent: TreeItem | undefined) {
        super(screen.name, parent, getContextProvider(screen));
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getScreenUri(this.project.id, this.screen._id, applicationType);
    }
}
