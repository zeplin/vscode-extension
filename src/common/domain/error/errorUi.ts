import * as vscode from "vscode";
import BarrelError from "../zeplinComponent/model/BarrelError";
import LoginCommand from "../../../session/command/LoginCommand";
import ManualLoginCommand from "../../../session/command/ManualLoginCommand";
import BaseError from "./BaseError";
import localization from "../../../localization";
import { tryCreateConfig } from "../../../coco/config/flow/configFlow";
import { getBarrelWebUrl } from "../openInZeplin/util/zeplinUris";
import MessageBuilder from "../../vscode/message/MessageBuilder";

enum ErrorCodes {
    NotLoggedIn = 401,
    RestrictedMember = 403,
    NotInvited = 404,
    Deleted = 410,
    Archived = 412
}

function showNotLoggedInError() {
    MessageBuilder.with(localization.session.notLoggedIn)
        .addOption(localization.session.login, LoginCommand.execute)
        .addOption(localization.session.authenticateWithToken, ManualLoginCommand.execute)
        .addOption(localization.common.cancel)
        .show();
}

function showNoConfigError() {
    MessageBuilder.with(localization.coco.common.noConfigFound)
        .addOption(localization.coco.common.createConfig, tryCreateConfig)
        .addOption(localization.common.cancel)
        .show();
}

function showGeneralError(error: BaseError): boolean {
    switch (error.code) {
        case ErrorCodes.NotLoggedIn:
            showNotLoggedInError();
            break;
        case ErrorCodes.RestrictedMember:
            MessageBuilder.with(localization.common.restrictedMember)
                .addOption(localization.common.ok)
                .show();
            break;
        default:
            MessageBuilder.with(localization.common.defaultError)
                .addOption(localization.common.ok)
                .show();
            break;
    }

    return true;
}

function showBarrelError(error: BarrelError): boolean {
    switch (error.code) {
        case ErrorCodes.Deleted:
        case ErrorCodes.Archived:
            MessageBuilder.with(getBarrelErrorMessage(error))
                .addOption(localization.common.ok)
                .show();
            return true;
        case ErrorCodes.NotInvited: {
            MessageBuilder
                .with(`${getBarrelErrorMessage(error)} ${localization.coco.zeplinComponent.joinBarrel}`)
                .addOption(
                    localization.coco.zeplinComponent.join,
                    () => vscode.env.openExternal(vscode.Uri.parse(getBarrelWebUrl(error.id, error.type)))
                )
                .addOption(localization.common.cancel)
                .show();
            return true;
        }
        default:
            return showGeneralError(error);
    }
}

function getBarrelErrorMessage(error: BarrelError): string {
    return `${error.message} (${error.id})`;
}

export {
    ErrorCodes,
    showNotLoggedInError,
    showNoConfigError,
    showGeneralError,
    showBarrelError
};
