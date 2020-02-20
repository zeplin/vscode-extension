import * as vscode from "vscode";
import { completeLogin } from "../../../session/flow/sessionFlow";
import { URLSearchParams } from "url";
import localization from "../../../localization/localization";
import MessageBuilder from "../../vscode/message/MessageBuilder";
import Logger from "../../../log/Logger";

const AUTHORIZED = "/authorized";
const QUERY_PARAMETER_TOKEN = "access_token";

class UriHandler implements vscode.UriHandler {
    public handleUri(uri: vscode.Uri) {
        Logger.log(`Uri received: ${uri.path}`);

        const parameters = new URLSearchParams(uri.query);
        switch (uri.path) {
            case AUTHORIZED:
                completeLogin(parameters.get(QUERY_PARAMETER_TOKEN) as string);
                break;
            default:
                MessageBuilder.with(localization.common.wrongUri).show();
                break;
        }
    }
}

export default new UriHandler();
