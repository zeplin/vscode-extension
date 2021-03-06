import * as vscode from "vscode";
import * as configUtil from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import Session from "../../../session/Session";
import localization from "../../../localization";
import { showNotLoggedInError, showNoConfigError } from "../../../common/domain/error/errorUi";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import { isFileDirty } from "../../../common/vscode/editor/textDocumentUtil";
import ConfigPaths from "../../config/util/ConfigPaths";

async function selectAndValidateConfig(pickerTitle: string, loginRequired = true):
    Promise<string | undefined> {
    // Check if there are any configs, fail if not so
    if (!ConfigPaths.any()) {
        showNoConfigError();
        return;
    }

    // Check if user is logged, fail if not so
    if (loginRequired && !Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    // Get active config or ask the user to do so, fail if none selected
    const configPath = ConfigPaths.getActive() ?? await showConfigPicker(pickerTitle);
    if (!configPath) {
        return;
    }

    // Check if selected config file is saved, fail if not so
    if (isFileDirty(configPath)) {
        MessageBuilder.with(localization.coco.common.configNotSaved).show();
        showInEditor(configPath);
        return;
    }

    // Check if selected config is valid, fail if not so
    if (!configUtil.isConfigValid(configPath)) {
        MessageBuilder.with(localization.coco.common.configInvalid).show();
        showInEditor(configPath);
        return;
    }

    return configPath;
}

// TODO: Add title
// TODO: Show only names for selection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showConfigPicker(pickerTitle: string): Thenable<string | undefined> {
    return vscode.window.showQuickPick(
        ConfigPaths.getAll(),
        { placeHolder: localization.common.selectFolder }
    );
}

export {
    selectAndValidateConfig
};
