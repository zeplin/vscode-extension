import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { createList } from "./zeplinComponentTreeUtil";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ZeplinUriProvider from "../../openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { getComponentsUri } from "../../../common/domain/openInZeplin/util/zeplinUris";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import localization from "../../../localization";
import ZeplinLinkType from "../../openInZeplin/model/ZeplinLinkType";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.ZeplinComponentBarrel,
    TreeItemContext.ZeplinLink
);

export default class BarrelZeplinComponentsTreeItem extends TreeItem implements ZeplinUriProvider {
    public constructor(public barrel: BarrelDetails, parent: TreeItem | undefined) {
        super(
            barrel.type === BarrelType.Project ? localization.sidebar.zeplinComponent.localStyleguide : barrel.name,
            parent,
            contextProvider,
            vscode.TreeItemCollapsibleState.Collapsed
        );
        this.setRemoteIconPath(barrel.thumbnail);
    }

    public getChildren(): TreeItem[] {
        const [{ components }, ...sections] = this.barrel.componentSections;
        return createList(components, sections, this.barrel, this);
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getComponentsUri(this.barrel.id, this.barrel.type, applicationType);
    }

    public getZeplinLinkType(): ZeplinLinkType {
        return this.barrel.type === BarrelType.Project ? ZeplinLinkType.Project : ZeplinLinkType.Styleguide;
    }
}
