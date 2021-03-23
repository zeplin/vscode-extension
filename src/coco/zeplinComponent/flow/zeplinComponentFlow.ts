import * as configUtil from "../../config/util/configUtil";
import localization from "../../../localization";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import { ComponentStore } from "../data/ComponentStore";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import ConfigBarrelsStore from "../data/ConfigBarrelsStore";
import ZeplinComponentsStore from "../../../common/domain/zeplinComponent/data/ZeplinComponentsStore";
import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import { getBarrelDetailRepresentationWithType } from "../../../common/domain/barrel/util/barrelUi";
import { getZeplinComponentDetailRepresentation } from "../../../common/domain/zeplinComponent/util/zeplinComponentUi";
import { showBarrelError } from "../../../common/domain/error/errorUi";
import { startAddProjectFlow, startAddStyleguideFlow } from "../../barrel/flow/barrelFlow";
import { startAddComponentFlow } from "../../component/flow/componentFlow";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import ZeplinComponentMigrationResult from "../model/ZeplinComponentMigrationResult";
import { askZeplinComponentMigrationIfNeeded } from "./migrateZeplinComponentsFlow";

async function startAddZeplinComponentsFlow(componentIndex?: number, preferIds?: boolean) {
    // Validate login and select config, fail if a modifiable config is not selected
    const configPath = await selectAndValidateConfig(localization.coco.zeplinComponent.connect);
    if (!configPath) {
        return;
    }

    // Check if config has any barrels, fail if not so
    if (!configUtil.hasBarrelsWithValidFormat(configPath)) {
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.noValidBarrelFound)
            .addOption(localization.common.barrel.add(BarrelType.Project), startAddProjectFlow)
            .addOption(localization.common.barrel.add(BarrelType.Styleguide), startAddStyleguideFlow)
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    // Check if config has any components, fail if not so
    if (!configUtil.hasComponents(configPath)) {
        showInEditor(configPath);
        MessageBuilder.with(localization.coco.zeplinComponent.noComponentFound)
            .addOption(localization.coco.component.add, startAddComponentFlow)
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    // Check if component is already selected or there is only one component in config, show component picker if not so
    let component = configUtil.getComponent(configPath, componentIndex) ?? configUtil.getActiveComponent(configPath);
    if (!component) {
        const componentPathQuickPickProvider = new QuickPickProvider(
            new ComponentStore(configPath),
            item => ({
                label: item.path
            })
        );
        componentPathQuickPickProvider.get().title = localization.coco.zeplinComponent.connect;
        componentPathQuickPickProvider.get().placeholder = localization.coco.zeplinComponent.selectComponent;
        component = await componentPathQuickPickProvider.startSingleSelection();
    }

    // Fail if no component path is selected
    if (!component) {
        return;
    }

    // Check if there is only one barrel in config, show barrel picker if not so
    let barrel = configUtil.getActiveBarrel(configPath);
    if (!barrel) {
        // Show barrel picker
        const barrelQuickPickProvider = new QuickPickProvider(
            new ConfigBarrelsStore(configPath),
            item => ({
                label: item.name,
                detail: getBarrelDetailRepresentationWithType(item)
            }),
            localization.coco.zeplinComponent.noBarrelFound,
            showBarrelError
        );
        barrelQuickPickProvider.get().title = localization.coco.zeplinComponent.connect;
        barrelQuickPickProvider.get().placeholder = localization.coco.zeplinComponent.selectBarrel;
        barrel = await barrelQuickPickProvider.startSingleSelection();
    }

    // Fail if no barrel is selected
    if (!barrel) {
        return;
    }

    // Prepare Zeplin component picker
    const zeplinComponentQuickPickProvider = new QuickPickProvider(
        new ZeplinComponentsStore(
            barrel.id, barrel.type, configUtil.getZeplinComponentsOfComponent(configPath, component.path)
        ),
        zeplinComponent => ({
            label: zeplinComponent.name,
            detail: getZeplinComponentDetailRepresentation(zeplinComponent)
        }),
        localization.coco.zeplinComponent.noZeplinComponentFound,
        showBarrelError
    );
    zeplinComponentQuickPickProvider.get().title = localization.coco.zeplinComponent.connect;
    zeplinComponentQuickPickProvider.get().placeholder = localization.coco.zeplinComponent.selectZeplinComponent;

    // Show Zeplin component picker
    const zeplinComponents = await zeplinComponentQuickPickProvider.startMultipleSelection();

    // Fail if no Zeplin component name is selected
    if (!zeplinComponents) {
        return;
    }

    // If migration question not answered before, ask migration
    const migrationResult = await askZeplinComponentMigrationIfNeeded(configPath, true);
    // Fail if operation is canceled on migration question
    if (migrationResult === ZeplinComponentMigrationResult.Canceled) {
        return;
    }

    const migrated = migrationResult === ZeplinComponentMigrationResult.Migrated;

    // Add Zeplin component
    configUtil.addZeplinComponents(configPath, component.path, zeplinComponents, migrated || preferIds);
    showInEditor(configPath);
    MessageBuilder
        .with(localization.coco.zeplinComponent.connected(zeplinComponents.length))
        .setType(MessageType.Info)
        .show();
}

export {
    startAddZeplinComponentsFlow
};
