import * as vscode from "vscode";
import Barrel from "../../../common/domain/barrel/Barrel";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import CumulativeBarrelDetailsStore from "../data/CumulativeBarrelDetailsStore";
import ExpandedErrorTreeItem from "../../../common/vscode/tree/ExpandedErrorTreeItem";
import BarrelZeplinComponentsTreeItem from "./BarrelZeplinComponentsTreeItem";
import { createList } from "./zeplinComponentTreeUtil";
import localization from "../../../localization";

export default class ZeplinComponentsTreeItem extends TreeItem {
    public constructor(private barrel: Barrel, parent: TreeItem | undefined) {
        super(
            localization.common.zeplinComponent.zeplinComponents,
            parent,
            undefined,
            vscode.TreeItemCollapsibleState.Collapsed
        );
    }

    public async getChildren(): Promise<TreeItem[]> {
        const { data, errors } = await new CumulativeBarrelDetailsStore(this.barrel.id, this.barrel.type).get();

        if (!data?.length) {
            const error = errors![0];
            return [new TreeItem(error.message, this)];
        } else if (data.length === 1 && !errors?.length) {
            const [{ components }, ...sections] = data[0].componentSections;
            return createList(components, sections, this.barrel, this);
        } else {
            const error = errors?.[0];
            const errorItems = error ? [new ExpandedErrorTreeItem(error.id, error.message, this)] : [];
            return [
                ...data.map(barrelDetails => new BarrelZeplinComponentsTreeItem(barrelDetails, this)),
                ...errorItems
            ];
        }
    }
}
