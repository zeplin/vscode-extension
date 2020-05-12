import * as vscode from "vscode";
import * as zeplinUrls from "../../../common/domain/openInZeplin/util/zeplinUrls";
import { isPreferredAppTypeSelected, setPreferredAppTypeSelected } from "../../../common/domain/openInZeplin/util/openInZeplinUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import Preferences from "../../../preferences/Preferences";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import ZeplinComponentTreeItem from "../../zeplinComponent/tree/ZeplinComponentTreeItem";
import ZeplinComponentSectionTreeItem from "../../zeplinComponent/tree/ZeplinComponentSectionTreeItem";
import localization from "../../../localization";
import { BarrelTreeItem } from "../../barrel/tree/BarrelTreeItem";
import BarrelZeplinComponentsTreeItem from "../../zeplinComponent/tree/BarrelZeplinComponentsTreeItem";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ScreenSectionTreeItem from "../../screen/tree/ScreenSectionTreeItem";
import ActivityTreeItem from "../../activity/tree/ActivityTreeItem";

async function openInZeplin(item: TreeItem) {
    if (!isPreferredAppTypeSelected()) {
        const result = await MessageBuilder.with(localization.sidebar.openInZeplin.selectPreferred)
            .setModal(true)
            .addOption(localization.sidebar.openInZeplin.web)
            .addOption(localization.sidebar.openInZeplin.app)
            .show();
        if (!result) {
            return;
        }

        await setPreferredAppTypeSelected(
            result === localization.sidebar.openInZeplin.web ? ApplicationType.Web : ApplicationType.App
        );
    }

    const applicationType = Preferences.PreferredApplicationType.get();
    let url;
    if (item.containsContext(TreeItemContext.Barrel)) {
        const { barrel: { id, type } } = item as BarrelTreeItem;
        url = zeplinUrls.getBarrelUrl(id, type, applicationType);
    } else if (item.containsContext(TreeItemContext.ZeplinComponentBarrel)) {
        const { barrel: { id, type } } = item as BarrelZeplinComponentsTreeItem;
        url = zeplinUrls.getBarrelUrl(id, type, applicationType);
    } else if (item.containsContext(TreeItemContext.Screen)) {
        const { screen: { _id: screenId }, project: { id: projectId } } = item as ScreenTreeItem;
        url = zeplinUrls.getScreenUrl(projectId, screenId, applicationType);
    } else if (item.containsContext(TreeItemContext.ScreenSection)) {
        const { section: { id: sectionId }, project: { id: projectId } } = item as ScreenSectionTreeItem;
        url = zeplinUrls.getScreenSectionUrl(projectId, sectionId, applicationType);
    } else if (item.containsContext(TreeItemContext.ZeplinComponent)) {
        const { zeplinComponent: { _id }, barrel: { id: barrelId, type } } = item as ZeplinComponentTreeItem;
        url = zeplinUrls.getComponentUrl(barrelId, type, _id, applicationType);
    } else if (item.containsContext(TreeItemContext.ZeplinComponentSection)) {
        const { section: { _id }, barrel: { id: barrelId, type } } = item as ZeplinComponentSectionTreeItem;
        url = zeplinUrls.getComponentSectionUrl(barrelId, type, _id, applicationType);
    } else if (item.containsContext(TreeItemContext.Activity)) {
        url = (item as ActivityTreeItem).activity.getZeplinUrl(applicationType);
    } else {
        throw new Error("Wrong item type for opening in Zeplin");
    }

    vscode.env.openExternal(vscode.Uri.parse(url));
}

export {
    openInZeplin
};
