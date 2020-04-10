import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import ZeplinComponentSection from "../../../common/domain/zeplinComponent/model/ZeplinComponentSection";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import { createList } from "./zeplinComponentTreeUtil";

export default class ZeplinComponentSectionTreeItem extends TreeItem {
    public static fromSection(section: ZeplinComponentSection): ZeplinComponentSectionTreeItem {
        return new ZeplinComponentSectionTreeItem(section.name, section.components, section.componentSections);
    }

    public static fromData(name: string, components: ResponseZeplinComponent[], sections: ZeplinComponentSection[]):
        ZeplinComponentSectionTreeItem {
        return new ZeplinComponentSectionTreeItem(name, components, sections);
    }

    private constructor(
        name: string,
        private components: ResponseZeplinComponent[],
        private sections: ZeplinComponentSection[]
    ) {
        super(name, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public getChildren(): Promise<TreeItem[]> {
        return Promise.resolve(createList(this.components, this.sections));
    }
}
