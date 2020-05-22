import TreeItem from "../../../common/vscode/tree/TreeItem";
import ZeplinComponentSection from "../../../common/domain/zeplinComponent/model/ZeplinComponentSection";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import ZeplinComponentTreeItem from "./ZeplinComponentTreeItem";
import ZeplinComponentSectionTreeItem from "./ZeplinComponentSectionTreeItem";
import localization from "../../../localization";
import Barrel from "../../../common/domain/barrel/Barrel";

function createList(
    components: ResponseZeplinComponent[], sections: ZeplinComponentSection[], barrel: Barrel, parent: TreeItem):
    TreeItem[] {
    const filledSections = sections?.filter(isSectionFilled) ?? [];
    if (components.length || filledSections.length) {
        return [
            ...components.map(component => new ZeplinComponentTreeItem(component, barrel, parent)),
            ...filledSections.map(section => new ZeplinComponentSectionTreeItem(section, barrel, parent))
        ];
    } else {
        return [new TreeItem(localization.sidebar.zeplinComponent.noneFound, parent)];
    }
}

function isSectionFilled(section: ZeplinComponentSection): boolean {
    return !!section.components.length || section.componentSections.some(isSectionFilled);
}

export {
    createList
};
