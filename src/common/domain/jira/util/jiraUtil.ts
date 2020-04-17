import JiraType from "../model/JiraType";
import Jira from "../model/Jira";
import ResponseBarrel from "../../barrel/model/ResponseBarrel";

function getProjectJiras(project: ResponseBarrel): Jira[] {
    return project.integration?.jira?.attachments?.filter(
        jira => jira.type === JiraType.Project && jira.itemId === project._id
    ) ?? [];
}

function getProjectItemJiras(project: ResponseBarrel): { ofScreenSections: Jira[]; ofScreens: Jira[] } {
    const jiras = project.integration?.jira?.attachments ?? [];
    return {
        ofScreenSections: jiras.filter(jira => jira.type === JiraType.ScreenSection),
        ofScreens: jiras.filter(jira => jira.type === JiraType.Screen)
    };
}

export {
    getProjectJiras,
    getProjectItemJiras
};
