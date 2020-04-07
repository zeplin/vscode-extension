import * as vscode from "vscode";
import ContextProvider from "../../vscode/extension/ContextProvider";
import Logger from "../../../log/Logger";
import { initializeSession } from "../../../session/util/SessionInitializer";
import { showWarningsAtStartUp } from "./zeplinExtensionUtil";
import Preferences from "../../../preferences/Preferences";
import CreateConfigCommand from "../../../coco/config/command/CreateConfigCommand";
import OpenConfigCommand from "../../../coco/config/command/OpenConfigCommand";
import LoginCommand from "../../../session/command/LoginCommand";
import ManualLoginCommand from "../../../session/command/ManualLoginCommand";
import LogoutCommand from "../../../session/command/LogoutCommand";
import ClearCacheCommand from "../../../session/command/ClearCacheCommand";
import AddProjectCommand from "../../../coco/barrel/command/AddProjectCommand";
import AddStyleguideCommand from "../../../coco/barrel/command/AddStyleguideCommand";
import AddComponentCommand from "../../../coco/component/command/AddComponentCommand";
import AddZeplinComponentCommand from "../../../coco/zeplinComponent/command/AddZeplinComponentCommand";
import AddGithubCommand from "../../../coco/repository/command/AddGithubCommand";
import AddGitlabCommand from "../../../coco/repository/command/AddGitlabCommand";
import AddBitbucketCommand from "../../../coco/repository/command/AddBitbucketCommand";
import AddPluginCommand from "../../../coco/plugin/command/AddPluginCommand";
import AddLinkCommand from "../../../coco/link/command/AddLinkCommand";
import SaveLogsCommand from "../../../log/command/SaveLogsCommand";
import OpenExternalUrlCommand from "../../vscode/command/OpenExternalUrlCommand";
import ShowComponentInConfigCommand from "../../../coco/component/command/ShowComponentInConfigCommand";
import UriHandler from "../uri/UriHandler";
import ConfigCodeLensProvider from "../../../coco/config/codeLens/ConfigCodeLensProvider";
import ComponentCodeLensProvider from "../../../coco/component/codeLens/ComponentCodeLensProvider";
import HoverProvider from "../../vscode/hover/HoverProvider";
import { updateConfigOnComponentRename } from "../../../coco/component/fileChange/componentRenameUtil";
import { registerCommand } from "../../vscode/extension/extensionUtil";
import ComponentLinkProvider from "../../../coco/component/documentLink/ComponentLinkProvider";
import ConfigDiagnosticsProvider from "../../../coco/config/diagnostic/ConfigDiagnosticsProvider";
import AddMultipleComponentsCommand from "../../../coco/component/command/AddMultipleComponentsCommand";
import AddMultipleZeplinComponentsCommand from "../../../coco/zeplinComponent/command/AddMultipleZeplinComponentsCommand";

export async function activate(context: vscode.ExtensionContext) {
    ContextProvider.initialize(context);
    Logger.log("Extension activating");
    await initializeSession();
    showWarningsAtStartUp();
    Preferences.initialize();

    const commands = [
        CreateConfigCommand,
        OpenConfigCommand,
        LoginCommand,
        ManualLoginCommand,
        LogoutCommand,
        ClearCacheCommand,
        AddProjectCommand,
        AddStyleguideCommand,
        AddComponentCommand,
        AddMultipleComponentsCommand,
        AddZeplinComponentCommand,
        AddMultipleZeplinComponentsCommand,
        AddGithubCommand,
        AddGitlabCommand,
        AddBitbucketCommand,
        AddPluginCommand,
        AddLinkCommand,
        SaveLogsCommand,
        OpenExternalUrlCommand,
        ShowComponentInConfigCommand
    ];
    const codeLensProviders = [
        ConfigCodeLensProvider,
        ComponentCodeLensProvider
    ];

    commands.forEach(registerCommand);

    if (vscode.workspace.onDidRenameFiles) { // This feature requires VS Code v1.41 and up.
        context.subscriptions.push(vscode.workspace.onDidRenameFiles(updateConfigOnComponentRename));
    }
    context.subscriptions.push(vscode.window.registerUriHandler(UriHandler));
    codeLensProviders.forEach(
        provider => context.subscriptions.push(
            vscode.languages.registerCodeLensProvider(provider.getDocumentSelector(), provider)
        )
    );
    context.subscriptions.push(ConfigCodeLensProvider.createWatcher());
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(HoverProvider.getDocumentSelector(), HoverProvider)
    );
    context.subscriptions.push(
        vscode.languages.registerDocumentLinkProvider(
            ComponentLinkProvider.getDocumentSelector(),
            ComponentLinkProvider
        )
    );
    context.subscriptions.push(ConfigDiagnosticsProvider.register());

    Logger.log("Extension activated");
}

export function deactivate() {
    Logger.log("Extension deactivating");
    // No need to clear anything.
}
