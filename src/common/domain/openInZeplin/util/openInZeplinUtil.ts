import * as vscode from "vscode";
import ApplicationType from "../model/ApplicationType";
import ContextProvider from "../../../vscode/extension/ContextProvider";
import Preferences from "../../../../preferences/Preferences";

const KEY_APP_TYPE_SELECTED = "preferredAppTypeSelected";

function filterPreferredAppType(setting: unknown): ApplicationType {
    return setting === ApplicationType.App ? ApplicationType.App : ApplicationType.Web;
}

function isPreferredAppTypeSelected(): boolean {
    return ContextProvider.get().globalState.get(KEY_APP_TYPE_SELECTED) ?? false;
}

async function setPreferredAppTypeSelected(type: ApplicationType) {
    await Preferences.PreferredApplicationType.update(type, vscode.ConfigurationTarget.Global);
    await ContextProvider.get().globalState.update(KEY_APP_TYPE_SELECTED, true);
}

export {
    filterPreferredAppType,
    isPreferredAppTypeSelected,
    setPreferredAppTypeSelected
};
