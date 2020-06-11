import TreeItem from "../../../common/vscode/tree/TreeItem";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import Barrel from "../../../common/domain/barrel/Barrel";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import { isComponentPinned } from "../../pin/util/pinUtil";
import ZeplinUriProvider from "../../../common/domain/openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { getComponentUri } from "../../../common/domain/openInZeplin/util/zeplinUris";
import ZeplinLinkType from "../../../common/domain/openInZeplin/model/ZeplinLinkType";

function getContextProvider(zeplinComponent: ResponseZeplinComponent): TreeItemContextProvider {
    return new TreeItemContextProvider(
        TreeItemContext.ZeplinComponent,
        TreeItemContext.ZeplinLink,
        isComponentPinned(zeplinComponent) ? TreeItemContext.Pinned : TreeItemContext.Pinnable
    );
}

export default class ZeplinComponentTreeItem extends TreeItem implements ZeplinUriProvider {
    public constructor(
        public zeplinComponent: ResponseZeplinComponent, public barrel: Barrel, parent: TreeItem | undefined
    ) {
        super(zeplinComponent.name, parent, getContextProvider(zeplinComponent));
        this.setRemoteIconPath(zeplinComponent.latestVersion.snapshot.url);
    }

    public getZeplinUri(applicationType: ApplicationType): string {
        return getComponentUri(this.barrel.id, this.barrel.type, this.zeplinComponent._id, applicationType);
    }

    public getZeplinLinkType(): ZeplinLinkType {
        return ZeplinLinkType.Component;
    }
}
