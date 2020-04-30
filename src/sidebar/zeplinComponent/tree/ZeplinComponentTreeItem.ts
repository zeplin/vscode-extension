import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import Barrel from "../../../common/domain/barrel/Barrel";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import { isComponentPinned } from "../../pin/util/pinUtil";

function getContextProvider(zeplinComponent: ResponseZeplinComponent): TreeItemContextProvider {
    return new TreeItemContextProvider(
        TreeItemContext.ZeplinComponent,
        TreeItemContext.ZeplinLink,
        isComponentPinned(zeplinComponent) ? TreeItemContext.Pinned : TreeItemContext.Pinnable
    );
}

export default class ZeplinComponentTreeItem extends TreeItem {
    public iconPath = vscode.Uri.parse(this.zeplinComponent.latestVersion.snapshot.url);

    public constructor(
        public zeplinComponent: ResponseZeplinComponent, public barrel: Barrel, parent: TreeItem | undefined
    ) {
        super(zeplinComponent.name, parent, getContextProvider(zeplinComponent));
    }
}
