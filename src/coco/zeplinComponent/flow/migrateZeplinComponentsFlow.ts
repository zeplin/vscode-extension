import * as vscode from "vscode";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import localization from "../../../localization";
import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import * as configUtil from "../../config/util/configUtil";
import * as zeplinComponentMigrationUtil from "../../zeplinComponent/util/zeplinComponentMigrationUtil";
import ConfigZeplinComponentsStore from "../data/ConfigZeplinComponentsStore";
import ZeplinComponentMigrationResult from "../model/ZeplinComponentMigrationResult";

async function askZeplinComponentMigrationIfNeeded(configPath: string, forceSelection: boolean):
    Promise<ZeplinComponentMigrationResult> {
    if (!forceSelection && zeplinComponentMigrationUtil.isZeplinComponentMigrationQuestionAsked(configPath)) {
        return ZeplinComponentMigrationResult.NotMigrated;
    }

    if (forceSelection && zeplinComponentMigrationUtil.isZeplinComponentMigrationQuestionAnswered(configPath)) {
        return ZeplinComponentMigrationResult.NotMigrated;
    }

    if (!zeplinComponentMigrationUtil.containsExplicitZeplinNames(configPath)) {
        return ZeplinComponentMigrationResult.NotMigrated;
    }

    zeplinComponentMigrationUtil.askedZeplinComponentMigrationQuestion(configPath);

    const answer = await MessageBuilder
        .with(localization.coco.zeplinComponent.askMigration)
        .addOption(localization.common.yes)
        .addOption(localization.common.no)
        .setModal(forceSelection)
        .setType(MessageType.Warning)
        .show();

    switch (answer) {
        case localization.common.yes:
            zeplinComponentMigrationUtil.answeredZeplinComponentMigrationQuestion(configPath);
            await startMigrateZeplinComponentsFlow(configPath);
            return ZeplinComponentMigrationResult.Migrated;
        case localization.common.no:
            zeplinComponentMigrationUtil.answeredZeplinComponentMigrationQuestion(configPath);
            return ZeplinComponentMigrationResult.NotMigrated;
        default:
            return ZeplinComponentMigrationResult.Canceled;
    }
}

async function startMigrateZeplinComponentsFlow(selectedConfigPath?: string) {
    // Validate login and select config, fail if a modifiable config is not selected
    const configPath = selectedConfigPath ?? await selectAndValidateConfig(localization.coco.zeplinComponent.migrate);
    if (!configPath) {
        return;
    }

    const config = configUtil.getConfig(configPath);
    // Check if config has any barrels, fail if not so
    if (!config.getValidBarrelsWithTypes().length) {
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.noBarrelFoundForMigration).show();
        return;
    }

    // Check if config has any components, fail if not so
    if (!configUtil.hasComponents(configPath)) {
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.noComponentFoundForMigration).show();
        return;
    }

    // Check if config has any Zeplin component names, fail if not so
    if (!config.getAllZeplinComponentNames().length) {
        zeplinComponentMigrationUtil.removeEmptyZeplinNamesAndAddZeplinIds(configPath);
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.noNameFoundForMigration).show();
        return;
    }

    const zeplinComponentsResult = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: localization.coco.zeplinComponent.migrationInProgress,
        cancellable: true
    }, async (_, cancellationToken) => {
        const result = await new ConfigZeplinComponentsStore(configPath).get();
        return cancellationToken.isCancellationRequested ? null : result;
    });

    // Fail if operation canceled by user
    if (!zeplinComponentsResult) {
        return;
    }

    const { data: allZeplinComponents = [], errors: zeplinComponentsDataError } = zeplinComponentsResult;
    // Check if any Zeplin components found on the barrels of the config, fail if not so
    if (!allZeplinComponents.length) {
        const errorMessage = zeplinComponentsDataError
            ? localization.coco.zeplinComponent.barrelErrorForMigration
            : localization.coco.zeplinComponent.noZeplinComponentFoundOnBarrelsForMigration;
        showInEditor(configPath);
        MessageBuilder.with(errorMessage).show();
        return;
    }

    const { migratedZeplinNameCount, nonMigratedZeplinNameCount } =
        zeplinComponentMigrationUtil.migrateZeplinComponents(configPath, allZeplinComponents);
    // Check if any component names are migrated, fail if not so
    if (!migratedZeplinNameCount) {
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.migrationErrors(nonMigratedZeplinNameCount)).show();
        return;
    }

    let migrationMessage = localization.coco.zeplinComponent.migrated(migratedZeplinNameCount);
    if (nonMigratedZeplinNameCount) {
        migrationMessage += ` ${localization.coco.zeplinComponent.migrationErrors(nonMigratedZeplinNameCount)}`;
    }

    showInEditor(configPath);
    MessageBuilder.with(migrationMessage).setType(MessageType.Info).show();
}

export {
    askZeplinComponentMigrationIfNeeded,
    startMigrateZeplinComponentsFlow
};
