import { extensionInitialized, isExtensionInitialized } from "../../vscode/extension/extensionUtil";
import { showLoginWarningAfterInstall } from "../../../session/flow/sessionFlow";
import Session from "../../../session/Session";

async function showWarningsAtStartUp() {
    if (!isExtensionInitialized() && !Session.isLoggedIn()) {
        showLoginWarningAfterInstall();
    }

    await extensionInitialized();
}

export {
    showWarningsAtStartUp
};
