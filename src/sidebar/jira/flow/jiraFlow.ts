import * as vscode from "vscode";
import TreeItem from "../../../common/vscode/tree/TreeItem";
import TreeItemContext from "../../../common/domain/tree/TreeItemContext";
import { BarrelTreeItem } from "../../barrel/tree/BarrelTreeItem";
import ScreenTreeItem from "../../screen/tree/ScreenTreeItem";
import ScreenSectionTreeItem from "../../screen/tree/ScreenSectionTreeItem";
import JiraAttachable from "../../../common/domain/jira/model/JiraAttachable";
import Jira from "../../../common/domain/jira/model/Jira";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import StaticStore from "../../../common/domain/store/StaticStore";
import localization from "../../../localization";

async function startOpenJiraLinkFlow(item: TreeItem) {
    let jiraAttachable: JiraAttachable;
    if (item.containsContext(TreeItemContext.Barrel)) {
        jiraAttachable = (item as BarrelTreeItem).barrel;
    } else if (item.containsContext(TreeItemContext.Screen)) {
        jiraAttachable = (item as ScreenTreeItem).screen;
    } else if (item.containsContext(TreeItemContext.ScreenSection)) {
        jiraAttachable = (item as ScreenSectionTreeItem).section;
    } else {
        throw new Error("Wrong item type for opening JIRA Link");
    }

    const { jiras } = jiraAttachable;
    if (!jiras.length) {
        throw new Error("No JIRAs attached to open link of");
    }

    let jira: Jira | undefined;
    if (jiras.length === 1) {
        jira = jiras[0]; // Auto select only attached JIRA
    } else {
        // Select JIRA to open
        const jiraQuickPickProvider = new QuickPickProvider(
            new StaticStore(jiras),
            current => ({
                label: current.issueKey
            })
        );
        jiraQuickPickProvider.get().title = localization.sidebar.jira.open;
        jiraQuickPickProvider.get().placeholder = localization.sidebar.jira.select;
        jira = await jiraQuickPickProvider.startSingleSelection();
    }

    // Fail if no JIRA is selected
    if (!jira) {
        return;
    }

    vscode.env.openExternal(vscode.Uri.parse(jira.issueUrl));
}

export {
    startOpenJiraLinkFlow
};
