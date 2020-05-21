import MixpanelHelper from "./util/MixpanelHelper";
import BarrelType from "../common/domain/barrel/BarrelType";
import PinType from "../sidebar/pin/model/PinType";
import ZeplinLinkType from "../sidebar/openInZeplin/model/ZeplinLinkType";
import JiraType from "../common/domain/jira/model/JiraType";
import {
    getAddableTypeName, getPinnableTypeName, getZeplinLinkTypeName, getJiraTypeName
} from "./util/analyticsTypeUtil";

class Analytics {
    public authenticated() {
        MixpanelHelper.track("Authenticated in VS Code extension");
    }

    public resourceAdded(type: BarrelType) {
        MixpanelHelper.track(
            "Added Zeplin resource in VS Code extension",
            { Type: getAddableTypeName(type) }
        );
    }

    public resourcePinned(type: PinType) {
        MixpanelHelper.track(
            "Pinned Zeplin resource in VS Code extension",
            { Type: getPinnableTypeName(type) }
        );
    }

    public zeplinLinkOpened(type: ZeplinLinkType) {
        MixpanelHelper.track(
            "Clicked Zeplin resource in VS Code extension",
            { Type: getZeplinLinkTypeName(type) }
        );
    }

    public jiraLinkOpened(type: JiraType) {
        MixpanelHelper.track(
            "Clicked Jira issue from VS Code extension",
            { Type: getJiraTypeName(type) }
        );
    }
}

export default new Analytics();
