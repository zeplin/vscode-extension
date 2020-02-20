# Technical Overview

## Messages

Messages for users are shown via [MessageBuilder].

It wraps vscode.window.show*Message methods. It unifies message usage and adds automatical [logging](#Logging) for
[flows](#Helpers).

## Stores

[Store] is an interface for caching and providing any data. It uses [Result] and [Error] to deliver results.
See [Data](#Data) section for usages.

## Pickers

Multiple choice pickers are shown via [QuickPickProvider].

It wraps vscode.createQuickPick method. It unifies picker usage and adds automatical [logging](#Logging) for
[flows](#Helpers).

It also eases the usage of remote data with pickers significantly via [Store] usage. Refresh data button is
automatically added to the picker.

## Logging

Logging is done only in user's local machine. User may choose to attach these logs while sending bug reports.

Log file is kept small and written to a file when user decides to do so.

[Logger] is responsible for logging. Many places in the code uses [Logger] such as [MessageBuilder] and
[QuickPickProvider].

## Localization

Though this extension supports only English, all language variant texts (visible to user) are kept in [localization] file.

## Extension.ts

Entry point of this extension is [extension.ts] file. `activate` method has the following order: Initializers,
Commands, other subscriptions.

## Subscriptions

Subscriptions has specific rules:

* Commands implement [Command].

    Examples: [CreateConfigCommand], [AddComponentCommand]

* Uri handlers reside in [UriHandler].

* Code Lens creators reside in [CodeLensProvider] instances and implement [CodeLensCreator].

    Examples: [LoginCodeLensCreator], [AddBarrelCodeLensCreator]

* Hover creators reside in [HoverProvider] and implement [ConfigHoverCreator].

    Examples: [BarrelHoverCreator], [ZeplinComponentHoverCreator]

* Diagnostic creators reside in [ConfigDiagnosticsProvider] and implement [DiagnosticCreator].

    Examples: [BarrelDiagnosticCreator], [ComponentDiagnosticCreator]

# Domain

☝️ Note: The term `barrel` is used as either `project` or `styleguide` throughout the project.

## Configuration File

Configuration is represented by [Config] and [configUtil] is used for reading and manipulating configuration files.

## Zeplin API

* Zeplin API requests are hold together in [api], API calls are made in [Data](#Data) classes.

## Data

* Remote data fetching and caching is done via [BasicStore]s, implements [Store]. Jump to [Stores](#Stores) section.

    Examples: [BarrelStore], [WorkspacesStore], [BarrelDetailsStore]

* Caching stores is done via StoreProviders.

    Examples: [BarrelsStoreProvider], [BarrelDetailsStoreProvider]

* Composite data fetching is done via composing data of [BasicStore]s.

    Examples: [ConfigBarrelsStore], [ZeplinComponentStore]

## Helpers

* `UI` Specific static helpers methods reside in files prefixed with `"Ui"` keyword.

    Examples: [zeplinComponentUi], [barrelUi]

* `Flow` files are used for achieving specific tasks. Each flow checks if the action is possible with considering user actions and config file state. These files are prefixed with `"Flow"` keyword.

    Examples: [barrelFlow], [componentFlow]

* `Other` static helpers methods reside in files prefixed with `"Util"` keyword.

    Examples: [zeplinHoverUtil], [zeplinComponentsUtil]

[AddBarrelCodeLensCreator]:     src/coco/barrel/codeLens/AddBarrelCodeLensCreator.ts
[BarrelStore]:                  src/coco/barrel/data/BarrelStore.ts
[BarrelsStoreProvider]:         src/coco/barrel/data/BarrelsStoreProvider.ts
[WorkspacesStore]:              src/coco/barrel/data/WorkspacesStore.ts
[BarrelDiagnosticCreator]:      src/coco/barrel/diagnostic/BarrelDiagnosticCreator.ts
[barrelFlow]:                   src/coco/barrel/flow/barrelFlow.ts
[BarrelHoverCreator]:           src/coco/barrel/hover/BarrelHoverCreator.ts
[barrelUi]:                     src/coco/barrel/util/barrelUi.ts
[AddComponentCommand]:          src/coco/component/command/AddComponentCommand.ts
[ComponentDiagnosticCreator]:   src/coco/component/diagnostic/ComponentDiagnosticCreator.ts
[componentFlow]:                src/coco/component/flow/componentFlow.ts
[CreateConfigCommand]:          src/coco/config/command/CreateConfigCommand.ts
[ConfigDiagnosticsProvider]:    src/coco/config/diagnostic/ConfigDiagnosticsProvider.ts
[ConfigHoverCreator]:           src/coco/config/hover/ConfigHoverCreator.ts
[Config]:                       src/coco/config/model/Config.ts
[configUtil]:                   src/coco/config/util/configUtil.ts
[BarrelDetailsStore]:           src/coco/zeplinComponent/data/BarrelDetailsStore.ts
[BarrelDetailsStoreProvider]:   src/coco/zeplinComponent/data/BarrelDetailsStoreProvider.ts
[ConfigBarrelsStore]:           src/coco/zeplinComponent/data/ConfigBarrelsStore.ts
[ZeplinComponentStore]:         src/coco/zeplinComponent/data/ZeplinComponentsStore.ts
[ZeplinComponentHoverCreator]:  src/coco/zeplinComponent/hover/ZeplinComponentHoverCreator.ts
[zeplinComponentUi]:            src/coco/zeplinComponent/util/zeplinComponentUi.ts
[zeplinComponentsUtil]:         src/coco/zeplinComponent/util/zeplinComponentUtil.ts
[api]:                          src/common/domain/api/api.ts
[Error]:                        src/common/domain/error/BaseError.ts
[extension.ts]:                 src/common/domain/extension/extension.ts
[zeplinHoverUtil]:              src/common/domain/hover/zeplinHoverUtil.ts
[BasicStore]:                   src/common/domain/store/BasicStore.ts
[Result]:                       src/common/domain/store/Result.ts
[Store]:                        src/common/domain/store/Store.ts
[CodeLensCreator]:              src/common/vscode/codeLens/CodeLensCreator.ts
[CodeLensProvider]:             src/common/vscode/codeLens/CodeLensProvider.ts
[Command]:                      src/common/vscode/command/Command.ts
[DiagnosticCreator]:            src/common/vscode/diagnostic/DiagnosticCreator.ts
[HoverProvider]:                src/common/vscode/hover/HoverProvider.ts
[MessageBuilder]:               src/common/vscode/message/MessageBuilder.ts
[QuickPickProvider]:            src/common/vscode/quickPick/QuickPickerProvider.ts
[UriHandler]:                   src/common/domain/uri/UriHandler.ts
[localization]:                 src/localization/localization.ts
[Logger]:                       src/log/Logger.ts
[LoginCodeLensCreator]:         src/session/codeLens/LoginCodeLensCreator.ts
