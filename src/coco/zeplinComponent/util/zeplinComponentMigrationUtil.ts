import ContextProvider from "../../../common/vscode/extension/ContextProvider";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import { getConfig, saveConfig } from "../../config/util/configUtil";
import { flatten } from "../../../common/general/arrayUtil";

const KEY_ASKED = "askedZeplinComponentMigrationQuestion";
const KEY_ANSWERED = "answeredZeplinComponentMigrationQuestion";

function getStateList(stateKey: string): string[] {
    return ContextProvider.get().globalState.get(stateKey) ?? [];
}

function addToStateList(configPath: string, stateKey: string) {
    const savedPaths = getStateList(stateKey);
    ContextProvider.get().globalState.update(stateKey, [...savedPaths, configPath]);
}

function isInStateList(configPath: string, stateKey: string): boolean {
    const savedPaths = getStateList(stateKey);
    return savedPaths.includes(configPath);
}

function askedZeplinComponentMigrationQuestion(configPath: string) {
    addToStateList(configPath, KEY_ASKED);
}

function isZeplinComponentMigrationQuestionAsked(configPath: string): boolean {
    return isInStateList(configPath, KEY_ASKED)
}

function answeredZeplinComponentMigrationQuestion(configPath: string) {
    addToStateList(configPath, KEY_ANSWERED);
}

function isZeplinComponentMigrationQuestionAnswered(configPath: string): boolean {
    return isInStateList(configPath, KEY_ANSWERED)
}

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
    askedZeplinComponentMigrationQuestion,
    isZeplinComponentMigrationQuestionAsked,
    answeredZeplinComponentMigrationQuestion,
    isZeplinComponentMigrationQuestionAnswered,
    containsExplicitZeplinNames,
    migrateZeplinComponents
};
