import { extensionInitialized, isExtensionInitialized } from "../../vscode/extension/extensionUtil";
import { areThereAnyConfigs } from "../../../coco/config/util/configUtil";
import { showCreateConfigWarningAfterInstall } from "../../../coco/config/flow/configFlow";
import { areThereAnyRootFolders } from "../../vscode/workspace/workspaceUtil";
import { showLoginWarningAfterInstall } from "../../../session/flow/sessionFlow";
import Session from "../../../session/Session";

async function showWarningsAtStartUp() {
    if (!isExtensionInitialized() && areThereAnyRootFolders()) {
        if (!areThereAnyConfigs()) {
            showCreateConfigWarningAfterInstall();
        } else if (!Session.isLoggedIn()) {
            showLoginWarningAfterInstall();
        }
    }

    await extensionInitialized();
}

export {
    showWarningsAtStartUp
};
