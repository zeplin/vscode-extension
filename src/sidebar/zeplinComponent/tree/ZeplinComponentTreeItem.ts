import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";

export default class ZeplinComponentTreeItem extends TreeItem {
    public constructor(private zeplinComponent: ResponseZeplinComponent) {
        super(zeplinComponent.name);
        this.iconPath = this.zeplinComponent.latestVersion.snapshot.url
            ? vscode.Uri.parse(this.zeplinComponent.latestVersion.snapshot.url, true)
            : undefined;
    }
}
