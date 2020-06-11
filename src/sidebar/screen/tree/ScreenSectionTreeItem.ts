import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ScreenSection from "../model/ScreenSection";
import ScreenTreeItem from "./ScreenTreeItem";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import Barrel from "../../../common/domain/barrel/Barrel";
import ZeplinUriProvider from "../../../common/domain/openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { getScreenSectionUri } from "../../../common/domain/openInZeplin/util/zeplinUris";
import ZeplinLinkType from "../../../common/domain/openInZeplin/model/ZeplinLinkType";

function getContextProvider(section: ScreenSection): TreeItemContextProvider {
    const contexts = [TreeItemContext.ScreenSection, TreeItemContext.ZeplinLink];
    if (section.jiras.length) {
        contexts.push(TreeItemContext.Jira);
    }
    return new TreeItemContextProvider(...contexts);
}

export default class ScreenSectionTreeItem extends TreeItem implements ZeplinUriProvider {
    public constructor(public section: ScreenSection, public project: Barrel, parent: TreeItem | undefined) {
        super(section.name, parent, getContextProvider(section), vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        return this.section.screens.map(screen => new ScreenTreeItem(screen, this.project, this));
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getScreenSectionUri(this.project.id, this.section.id, applicationType);
    }

    public getZeplinLinkType(): ZeplinLinkType {
        return ZeplinLinkType.ScreenSection;
    }
}
