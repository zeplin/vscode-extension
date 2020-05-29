import * as vscode from "vscode";
import TreeItemContextProvider from "./TreeItemContextProvider";
import { getCroppedImageUrl } from "../../domain/image/zeplinImageUtil";
import { refreshItem } from "../../../sidebar/refresh/util/refreshUtil";
import TreeItemContext from "../../domain/tree/TreeItemContext";
import OpenInZeplinOnDoubleClickCommand from "../../../sidebar/openInZeplin/command/OpenInZeplinOnDoubleClickCommand";

const ICON_SIZE = 32;

export default class TreeItem extends vscode.TreeItem {
    public constructor(
        label: string,
        private parent: TreeItem | undefined,
        private contextProvider?: TreeItemContextProvider,
        collapsibleState?: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.contextValue = this.contextProvider?.get();
        if (contextProvider?.contains(TreeItemContext.ZeplinLink)) {
            this.command = {
                command: OpenInZeplinOnDoubleClickCommand.name,
                title: "",
                arguments: [this]
            };
        }
    }

    public containsContext(contextValue: string): boolean {
        return this.contextProvider?.contains(contextValue) ?? false;
    }

    public getChildren(): vscode.ProviderResult<TreeItem[]> {
        return [];
    }

    public getParent(): TreeItem | undefined {
        return this.parent;
    }

    protected async setRemoteIconPath(path: string | undefined) {
        if (path) {
            const croppedImageUrl = await getCroppedImageUrl(path, ICON_SIZE, ICON_SIZE);
            this.iconPath = croppedImageUrl ? vscode.Uri.parse(croppedImageUrl) : undefined;

            refreshItem(this);
        }
    }
}
