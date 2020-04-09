import Barrel from "../../../common/domain/barrel/Barrel";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";
import BarrelTreeDataProvider from "../tree/BarrelTreeDataProvider";

const KEY_SAVED_BARRELS = "sidebar.savedBarrels";

function getSavedBarrels(): Barrel[] {
    return ContextProvider.get().workspaceState.get(KEY_SAVED_BARRELS) ?? [];
}

function saveBarrels(barrels: Barrel[]) {
    ContextProvider.get().workspaceState.update(KEY_SAVED_BARRELS, barrels);

    BarrelTreeDataProvider.refresh();
}

function isBarrelSaved(barrel: Barrel): boolean {
    return getSavedBarrels().some(savedBarrel => savedBarrel.id === barrel.id);
}

function saveBarrel(barrel: Barrel) {
    const barrels = getSavedBarrels();
    const updateIndex = barrels.findIndex(savedBarrel => savedBarrel.id === barrel.id);
    if (updateIndex >= 0) {
        barrels[updateIndex] = barrel;
    } else {
        barrels.push(barrel);
    }
    saveBarrels(barrels);
}

function removeBarrel(barrel: Barrel) {
    const barrels = getSavedBarrels().filter(savedBarrel => savedBarrel.id !== barrel.id);
    saveBarrels(barrels);
}

export {
    getSavedBarrels,
    isBarrelSaved,
    saveBarrel,
    removeBarrel
};
