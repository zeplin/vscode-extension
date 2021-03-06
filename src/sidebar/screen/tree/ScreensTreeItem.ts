import * as vscode from "vscode";
import Barrel from "../../../common/domain/barrel/Barrel";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import localization from "../../../localization";
import ProjectScreensStore from "../data/ProjectScreensStore";
import ScreenSection from "../model/ScreenSection";
import ScreenTreeItem from "./ScreenTreeItem";
import ScreenSectionTreeItem from "./ScreenSectionTreeItem";

export default class ScreensTreeItem extends TreeItem {
    public constructor(private project: Barrel, parent: TreeItem | undefined) {
        super(localization.sidebar.screen.screens, parent, undefined, vscode.TreeItemCollapsibleState.Collapsed);
    }

    public async getChildren(): Promise<TreeItem[]> {
        const { data, errors } = await new ProjectScreensStore(this.project.id).get();
        if (!data) {
            const error = errors![0];
            return [new TreeItem(error.message, this)];
        } else {
            const { screens, sections } = data;
            const filledSections = sections?.filter(this.isSectionFilled) ?? [];
            if (screens.length || filledSections.length) {
                return [
                    ...screens.map(screen => new ScreenTreeItem(screen, this.project, this)),
                    ...filledSections.map(section => new ScreenSectionTreeItem(section, this.project, this))
                ];
            } else {
                return [new TreeItem(localization.sidebar.screen.noneFound, this)];
            }
        }
    }

    private isSectionFilled(section: ScreenSection) {
        return !!section.screens.length;
    }
}
