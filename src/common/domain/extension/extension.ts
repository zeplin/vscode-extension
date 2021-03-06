import * as vscode from "vscode";
import ContextProvider from "../../vscode/extension/ContextProvider";
import Logger from "../../../log/Logger";
import { initializeSession } from "../../../session/util/SessionInitializer";
import { showWarningsAtStartUp } from "./zeplinExtensionUtil";
import Preferences from "../../../preferences/Preferences";
import RefreshSidebarCommand from "../../../sidebar/refresh/command/RefreshSidebarCommand";
import AddProjectToSidebarCommand from "../../../sidebar/barrel/command/AddProjectToSidebarCommand";
import AddStyleguideToSidebarCommand from "../../../sidebar/barrel/command/AddStyleguideToSidebarCommand";
import RemoveBarrelFromSidebarCommand from "../../../sidebar/barrel/command/RemoveBarrelFromSidebarCommand";
import JumpToSidebarItemCommand from "../../../sidebar/jumpTo/command/JumpToSidebarItemCommand";
import AddBarrelToSidebarCommand from "../../../sidebar/barrel/command/AddBarrelToSidebarCommand";
import OpenInZeplinCommand from "../openInZeplin/command/OpenInZeplinCommand";
import OpenInZeplinOnDoubleClickCommand from "../../../sidebar/openInZeplin/command/OpenInZeplinOnDoubleClickCommand";
import OpenJiraLinkCommand from "../../../sidebar/jira/command/OpenJiraLinkCommand";
import PinToSidebarCommand from "../../../sidebar/pin/command/PinToSidebarCommand";
import UnpinFromSidebarCommand from "../../../sidebar/pin/command/UnpinFromSidebarCommand";
import PinScreenToSidebarCommand from "../../../sidebar/pin/command/PinScreenToSidebarCommand";
import PinComponentToSidebarCommand from "../../../sidebar/pin/command/PinComponentToSidebarCommand";
import UnpinAllFromSidebarCommand from "../../../sidebar/pin/command/UnpinAllFromSidebarCommand";
import CreateConfigCommand from "../../../coco/config/command/CreateConfigCommand";
import SetConfigCommand from "../../../coco/config/command/SetConfigCommand";
import SetConfigRootCommand from "../../../coco/config/command/SetConfigRootCommand";
import UnsetConfigCommand from "../../../coco/config/command/UnsetConfigCommand";
import OpenConfigCommand from "../../../coco/config/command/OpenConfigCommand";
import LoginCommand from "../../../session/command/LoginCommand";
import ManualLoginCommand from "../../../session/command/ManualLoginCommand";
import LogoutCommand from "../../../session/command/LogoutCommand";
import ClearCacheCommand from "../../../session/command/ClearCacheCommand";
import AddProjectCommand from "../../../coco/barrel/command/AddProjectCommand";
import AddStyleguideCommand from "../../../coco/barrel/command/AddStyleguideCommand";
import AddComponentCommand from "../../../coco/component/command/AddComponentCommand";
import AddComponentsCommand from "../../../coco/component/command/AddComponentsCommand";
import AddZeplinComponentsCommand from "../../../coco/zeplinComponent/command/AddZeplinComponentsCommand";
import MigrateZeplinComponentsCommand from "../../../coco/zeplinComponent/command/MigrateZeplinComponentsCommand";
import AddRepositoryCommand from "../../../coco/repository/command/AddRepositoryCommand";
import AddPluginCommand from "../../../coco/plugin/command/AddPluginCommand";
import AddLinkCommand from "../../../coco/link/command/AddLinkCommand";
import SaveLogsCommand from "../../../log/command/SaveLogsCommand";
import ShowComponentInConfigCommand from "../../../coco/component/command/ShowComponentInConfigCommand";
import UriHandler from "../uri/UriHandler";
import ConfigCodeLensProvider from "../../../coco/config/codeLens/ConfigCodeLensProvider";
import CustomConfigCodeLensProvider from "../../../coco/config/codeLens/CustomConfigCodeLensProvider";
import ComponentCodeLensProvider from "../../../coco/component/codeLens/ComponentCodeLensProvider";
import HoverProvider from "../../vscode/hover/HoverProvider";
import { updateConfigOnComponentRename } from "../../../coco/component/fileChange/componentRenameUtil";
import { updatePathOnCustomConfigRename, removePathOnCustomConfigDelete } from "../../../coco/config/fileChange/configRenameUtil";
import { registerCommand } from "../../vscode/extension/extensionUtil";
import ComponentLinkProvider from "../../../coco/component/documentLink/ComponentLinkProvider";
import ConfigDiagnosticsProvider from "../../../coco/config/diagnostic/ConfigDiagnosticsProvider";
import BarrelTreeDataProvider from "../../../sidebar/barrel/tree/BarrelTreeDataProvider";
import PinTreeDataProvider from "../../../sidebar/pin/tree/PinTreeDataProvider";
import ActivityTreeDataProvider from "../../../sidebar/activity/tree/ActivityTreeDataProvider";
import { askZeplinComponentMigrationOnConfigOpen } from "../../../coco/zeplinComponent/fileOperation/askZeplinComponentMigrationUtil";

export async function activate(context: vscode.ExtensionContext) {
    ContextProvider.initialize(context);
    Logger.log("Extension activating");
    await initializeSession();
    showWarningsAtStartUp();
    Preferences.initialize();

    const commands = [
        RefreshSidebarCommand,
        AddProjectToSidebarCommand,
        AddStyleguideToSidebarCommand,
        RemoveBarrelFromSidebarCommand,
        JumpToSidebarItemCommand,
        AddBarrelToSidebarCommand,
        OpenInZeplinCommand,
        OpenInZeplinOnDoubleClickCommand,
        OpenJiraLinkCommand,
        PinToSidebarCommand,
        UnpinFromSidebarCommand,
        PinScreenToSidebarCommand,
        PinComponentToSidebarCommand,
        UnpinAllFromSidebarCommand,
        CreateConfigCommand,
        OpenConfigCommand,
        SetConfigCommand,
        SetConfigRootCommand,
        UnsetConfigCommand,
        LoginCommand,
        ManualLoginCommand,
        LogoutCommand,
        ClearCacheCommand,
        AddProjectCommand,
        AddStyleguideCommand,
        AddComponentCommand,
        AddComponentsCommand,
        AddZeplinComponentsCommand,
        MigrateZeplinComponentsCommand,
        AddRepositoryCommand,
        AddPluginCommand,
        AddLinkCommand,
        SaveLogsCommand,
        ShowComponentInConfigCommand
    ];
    const codeLensProviders = [
        ConfigCodeLensProvider,
        CustomConfigCodeLensProvider,
        ComponentCodeLensProvider
    ];

    commands.forEach(registerCommand);

    if (vscode.workspace.onDidRenameFiles) { // This feature requires VS Code v1.41 and up.
        context.subscriptions.push(vscode.workspace.onDidRenameFiles(updateConfigOnComponentRename));
        context.subscriptions.push(vscode.workspace.onWillRenameFiles(updatePathOnCustomConfigRename));
        context.subscriptions.push(vscode.workspace.onWillDeleteFiles(removePathOnCustomConfigDelete));
    }
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(askZeplinComponentMigrationOnConfigOpen));
    context.subscriptions.push(vscode.window.registerUriHandler(UriHandler));
    codeLensProviders.forEach(
        provider => context.subscriptions.push(
            vscode.languages.registerCodeLensProvider(provider.getDocumentSelector(), provider)
        )
    );
    context.subscriptions.push(ConfigCodeLensProvider.createWatcher());
    context.subscriptions.push(CustomConfigCodeLensProvider.createWatcher());
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

    const treeDataProviders = [
        BarrelTreeDataProvider,
        PinTreeDataProvider,
        ActivityTreeDataProvider
    ];
    treeDataProviders.forEach(provider => context.subscriptions.push(provider.register()));

    Logger.log("Extension activated");
}

export function deactivate() {
    Logger.log("Extension deactivating");
    // No need to clear anything.
}
