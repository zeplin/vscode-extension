import BarrelType from "../../common/domain/barrel/BarrelType";
import PinType from "../../sidebar/pin/model/PinType";
import ZeplinLinkType from "../../common/domain/openInZeplin/model/ZeplinLinkType";
import JiraType from "../../common/domain/jira/model/JiraType";

function getAddableTypeName(type: BarrelType) {
    switch (type) {
        case BarrelType.Project:
            return "Project";
        case BarrelType.Styleguide:
            return "Styleguide";
        default:
            throw new Error(`Unhandled barrel type: ${type}`);
    }
}

function getPinnableTypeName(type: PinType) {
    switch (type) {
        case PinType.Screen:
            return "Screen";
        case PinType.Component:
            return "Component";
        default:
            throw new Error(`Unhandled pin type: ${type}`);
    }
}

function getZeplinLinkTypeName(type: ZeplinLinkType) {
    switch (type) {
        case ZeplinLinkType.Project:
            return "Project";
        case ZeplinLinkType.Styleguide:
            return "Styleguide";
        case ZeplinLinkType.ScreenSection:
            return "Screen Section";
        case ZeplinLinkType.ComponentSection:
            return "Component Section";
        case ZeplinLinkType.Screen:
            return "Screen";
        case ZeplinLinkType.Component:
            return "Component";
        default:
            throw new Error(`Unhandled Zeplin link type: ${type}`);
    }
}

function getJiraTypeName(type: JiraType) {
    switch (type) {
        case JiraType.Project:
            return "Project";
        case JiraType.ScreenSection:
            return "Screen Section";
        case JiraType.Screen:
            return "Screen";
        default:
            throw new Error(`Unhandled Jira type: ${type}`);
    }
}

export {
    getAddableTypeName,
    getPinnableTypeName,
    getZeplinLinkTypeName,
    getJiraTypeName
};
