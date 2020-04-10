import TreeItem from "../../../common/vscode/tree/TreeItem";
import ZeplinComponentSection from "../../../common/domain/zeplinComponent/model/ZeplinComponentSection";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import ZeplinComponentTreeItem from "./ZeplinComponentTreeItem";
import ZeplinComponentSectionTreeItem from "./ZeplinComponentSectionTreeItem";
import localization from "../../../localization";

function createList(components: ResponseZeplinComponent[], sections: ZeplinComponentSection[]): TreeItem[] {
    const filledSections = sections?.filter(isSectionFilled) ?? [];
    if (components.length || filledSections.length) {
        return [
            ...components.map(component => new ZeplinComponentTreeItem(component)),
            ...filledSections.map(ZeplinComponentSectionTreeItem.fromSection)
        ];
    } else {
        return [new TreeItem(localization.sidebar.zeplinComponent.noneFound)];
    }
}

function isSectionFilled(section: ZeplinComponentSection): boolean {
    return !!section.components.length || section.componentSections.some(isSectionFilled);
}

export {
    createList
};
