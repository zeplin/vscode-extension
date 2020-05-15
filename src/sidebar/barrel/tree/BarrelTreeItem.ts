import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Barrel from "../../../common/domain/barrel/Barrel";
import ScreensTreeItem from "../../screen/tree/ScreensTreeItem";
import ZeplinComponentsTreeItem from "../../zeplinComponent/tree/ZeplinComponentsTreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinUriProvider from "../../openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { getBarrelUri } from "../../../common/domain/openInZeplin/util/zeplinUris";

function getContextProvider(barrel: Barrel): TreeItemContextProvider {
    const contexts = [TreeItemContext.Barrel, TreeItemContext.ZeplinLink];
    if (barrel.jiras.length) {
        contexts.push(TreeItemContext.Jira);
    }
    return new TreeItemContextProvider(...contexts);
}

export class BarrelTreeItem extends TreeItem implements ZeplinUriProvider {
    public constructor(public barrel: Barrel) {
        super(barrel.name, undefined, getContextProvider(barrel), vscode.TreeItemCollapsibleState.Collapsed);
        this.setRemoteIconPath(barrel.thumbnail);
    }

    public getChildren(): TreeItem[] {
        const children: TreeItem[] = [new ZeplinComponentsTreeItem(this.barrel, this)];
        if (this.barrel.type === BarrelType.Project) {
            children.unshift(new ScreensTreeItem(this.barrel, this));
        }

        return children;
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getBarrelUri(this.barrel.id, this.barrel.type, applicationType);
    }
}
