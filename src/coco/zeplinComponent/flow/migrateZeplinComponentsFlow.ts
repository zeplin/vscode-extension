import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import localization from "../../../localization";
import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import * as configUtil from "../../config/util/configUtil";
import * as zeplinComponentMigrationUtil from "../../zeplinComponent/util/zeplinComponentMigrationUtil";
import ConfigZeplinComponentsStore from "../data/ConfigZeplinComponentsStore";

async function startMigrateZeplinComponentsFlow() {
    // Validate login and select config, fail if a modifiable config is not selected
    const configPath = await selectAndValidateConfig(localization.coco.zeplinComponent.migrate);
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
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.noNameFoundForMigration).show();
        return;
    }

    // Check if any Zeplin components found on the barrels of the config, fail if not so
    const { data: allZeplinComponents = [], errors: zeplinComponentsDataError } =
        await new ConfigZeplinComponentsStore(configPath).get();
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
    startMigrateZeplinComponentsFlow
};
