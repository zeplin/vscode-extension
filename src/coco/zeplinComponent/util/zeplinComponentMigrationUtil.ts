import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import { getConfig, saveConfig } from "../../config/util/configUtil";
import { flatten } from "../../../common/general/arrayUtil";

function containsExplicitZeplinNames(configPath: string): boolean {
    return getConfig(configPath).getAllZeplinComponentNames().some(name => !name.includes("*"));
}

function migrateZeplinComponents(configPath: string, allZeplinComponents: ZeplinComponent[]):
    { migratedZeplinNameCount: number; nonMigratedZeplinNameCount: number; } {
    const config = getConfig(configPath);
    const components = config.getComponents();
    const preMigrationZeplinNameCount = flatten(components.map(({ zeplinNames }) => zeplinNames)).length;

    for (const component of components) {
        for (const zeplinName of component.zeplinNames ?? []) {
            const correspondingIds = allZeplinComponents
                .filter(({ name }) => zeplinName === name)
                .map(({ _id }) => _id);
            if (correspondingIds.length) {
                component.zeplinNames = component.zeplinNames!.filter(current => current !== zeplinName);
                const idsToAdd = correspondingIds.filter(id => !component.zeplinIds?.includes(id));
                (component.zeplinIds ??= []).push(...idsToAdd);
            }
        }

        if (!component.zeplinNames?.length && component.zeplinIds?.length) {
            component.zeplinNames = undefined;
        }
    }
    const nonMigratedZeplinNameCount = flatten(components.map(({ zeplinNames }) => zeplinNames)).length;
    const migratedZeplinNameCount = preMigrationZeplinNameCount - nonMigratedZeplinNameCount;

    if (migratedZeplinNameCount) {
        saveConfig(configPath, config);
    }

    return {
        migratedZeplinNameCount,
        nonMigratedZeplinNameCount
    };
}

export {
    containsExplicitZeplinNames,
    migrateZeplinComponents
};
