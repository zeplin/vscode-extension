import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import Barrel from "../../../common/domain/barrel/Barrel";
import TreeItemContextProvider from "../../../common/vscode/tree/TreeItemContextProvider";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";

const contextProvider = new TreeItemContextProvider(
    TreeItemContext.ZeplinComponent,
    TreeItemContext.ZeplinLink
);

export default class ZeplinComponentTreeItem extends TreeItem {
    public iconPath = this.zeplinComponent.latestVersion.snapshot.url
        ? vscode.Uri.parse(this.zeplinComponent.latestVersion.snapshot.url, true)
        : undefined;

    public constructor(public zeplinComponent: ResponseZeplinComponent, public barrel: Barrel) {
        super(zeplinComponent.name, contextProvider);
    }
}
