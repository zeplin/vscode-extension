import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { createList } from "./zeplinComponentTreeUtil";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ZeplinUriProvider from "../../openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { getBarrelUri } from "../../../common/domain/openInZeplin/util/zeplinUris";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.ZeplinComponentBarrel,
    TreeItemContext.ZeplinLink
);

export default class BarrelZeplinComponentsTreeItem extends TreeItem implements ZeplinUriProvider {
    public iconPath = this.barrel.thumbnail ? vscode.Uri.parse(this.barrel.thumbnail, true) : undefined;

    public constructor(public barrel: BarrelDetails, title: string | undefined, parent: TreeItem | undefined) {
        super(title ?? barrel.name, parent, contextProvider, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): TreeItem[] {
        const [{ components }, ...sections] = this.barrel.componentSections;
        return createList(components, sections, this.barrel, this);
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getBarrelUri(this.barrel.id, this.barrel.type, applicationType);
    }
}
