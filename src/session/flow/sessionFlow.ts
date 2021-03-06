import * as vscode from "vscode";
import localization from "../../localization";
import Session from "../Session";
import UriHandler from "../../common/domain/uri/UriHandler";
import { isUri } from "../../common/vscode/uri/uriUtil";
import ConfigCodeLensProvider from "../../coco/config/codeLens/ConfigCodeLensProvider";
import configuration from "../../common/domain/extension/configuration";
import { showNotLoggedInError } from "../../common/domain/error/errorUi";
import MessageBuilder from "../../common/vscode/message/MessageBuilder";
import MessageType from "../../common/vscode/message/MessageType";
import Analytics from "../../analytics/Analytics";
import Refresher from "../util/Refresher";

function showLoginWarningAfterInstall() {
    MessageBuilder.with(localization.session.askLogin)
        .setType(MessageType.Info)
        .addOption(localization.session.login, tryLogin)
        .addOption(localization.common.cancel)
        .show();
}

function tryLogin() {
    const oauthUrl = `${configuration.webUrl}/oauth/authorize?client_id=${configuration.oauthClientId}&scope=read`;
    vscode.env.openExternal(vscode.Uri.parse(oauthUrl));
}

async function tryManualLogin() {
    const input = await vscode.window.showInputBox({
        placeHolder: localization.session.enterToken,
        ignoreFocusOut: true
    });

    if (!input) {
        return;
    }

    if (isUri(input)) {
        UriHandler.handleUri(vscode.Uri.parse(input));
    } else {
        completeLogin(input);
    }
}

async function completeLogin(token: string) {
    await Session.setToken(token);
    Refresher.refresh();
    ConfigCodeLensProvider.refresh();
    MessageBuilder.with(localization.session.loggedIn).setType(MessageType.Info).show();
    Analytics.authenticated();
}

function tryLogout() {
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
    } else {
        askLogout();
    }
}

function askLogout() {
    MessageBuilder.with(localization.session.askLogout)
        .setType(MessageType.Info)
        .addOption(localization.session.askLogout, completeLogout)
        .addOption(localization.common.cancel)
        .show();
}

async function completeLogout() {
    await Session.removeToken();
    Refresher.refresh();
    ConfigCodeLensProvider.refresh();
    MessageBuilder.with(localization.session.logoutSuccessful).setType(MessageType.Info).show();
}

function clearCacheAndNotify() {
    Refresher.refresh();
    MessageBuilder.with(localization.session.cacheCleared).setType(MessageType.Info).show();
}

export {
    showLoginWarningAfterInstall,
    tryLogin,
    tryManualLogin,
    completeLogin,
    tryLogout,
    clearCacheAndNotify
};
