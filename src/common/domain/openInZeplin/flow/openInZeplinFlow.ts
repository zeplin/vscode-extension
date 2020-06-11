import * as vscode from "vscode";
import { isPreferredAppTypeSelected, setPreferredAppTypeSelected } from "../util/openInZeplinUtil";
import MessageBuilder from "../../../vscode/message/MessageBuilder";
import ApplicationType from "../model/ApplicationType";
import Preferences from "../../../../preferences/Preferences";
import localization from "../../../../localization";
import ZeplinUriProvider from "../model/ZeplinUriProvider";
import Analytics from "../../../../analytics/Analytics";
import Logger from "../../../../log/Logger";
import ZeplinLinkType from "../model/ZeplinLinkType";
import ZeplinUris from "../model/ZeplinUris";

type ZeplinUriProviderLike = ZeplinUriProvider | ZeplinUris;

async function openInZeplin(uriProviderLike: ZeplinUriProviderLike) {
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
    const uriProvider = getUriProvider(uriProviderLike);
    vscode.env.openExternal(vscode.Uri.parse(uriProvider.getZeplinUri(applicationType)));
    Analytics.zeplinLinkOpened(uriProvider.getZeplinLinkType());
    Logger.log(`Item opened in Zeplin: ${applicationType}`);
}

function getUriProvider(uriProviderLike: ZeplinUriProviderLike): ZeplinUriProvider {
    // As ZeplinUriProviderLike types are interfaces, instanceof check could not be used
    if ("appUri" in uriProviderLike) {
        const { appUri, webUrl, type } = uriProviderLike as ZeplinUris;
        return {
            getZeplinUri(applicationType: ApplicationType): string {
                return applicationType === ApplicationType.App ? appUri : webUrl;
            },

            getZeplinLinkType(): ZeplinLinkType {
                return type;
            }
        } as ZeplinUriProvider;
    } else {
        return uriProviderLike;
    }
}

export {
    openInZeplin
};
