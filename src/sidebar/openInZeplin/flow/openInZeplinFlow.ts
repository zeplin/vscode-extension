import * as vscode from "vscode";
import { isPreferredAppTypeSelected, setPreferredAppTypeSelected } from "../../../common/domain/openInZeplin/util/openInZeplinUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import Preferences from "../../../preferences/Preferences";
import localization from "../../../localization";
import ZeplinUriProvider from "../model/ZeplinUriProvider";
import Analytics from "../../../analytics/Analytics";
import Logger from "../../../log/Logger";

async function openInZeplin(uriProvider: ZeplinUriProvider) {
    if (!isPreferredAppTypeSelected()) {
        const result = await MessageBuilder.with(localization.sidebar.openInZeplin.selectPreferred)
            .setModal(true)
            .addOption(localization.sidebar.openInZeplin.web)
            .addOption(localization.sidebar.openInZeplin.app)
            .show();
        if (!result) {
            return;
        }

        Logger.log(`Preferred app type selected: ${result}`);
        await setPreferredAppTypeSelected(
            result === localization.sidebar.openInZeplin.web ? ApplicationType.Web : ApplicationType.App
        );
    } else {
        Logger.log(`Preferred app type already selected`);
    }

    const applicationType = Preferences.PreferredApplicationType.get();
    const uri = uriProvider.getZeplinUri(applicationType);
    vscode.env.openExternal(vscode.Uri.parse(uri));
    Analytics.zeplinLinkOpened(uriProvider.getZeplinLinkType());
    Logger.log(`Item opened in Zeplin: ${applicationType}`);
}

export {
    openInZeplin
};
