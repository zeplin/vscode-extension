import ContextProvider from "../../../common/vscode/extension/ContextProvider";
import Screen from "../../screen/model/Screen";
import Barrel from "../../../common/domain/barrel/Barrel";
import PinType from "../model/PinType";
import ComponentPinData from "../model/ComponentPinData";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import PinData from "../model/PinData";
import ScreenPinData from "../model/ScreenPinData";
import { setContext } from "../../../common/vscode/ide/builtinCommands";
import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import PinTreeDataProvider from "../tree/PinTreeDataProvider";

const KEY_PINNED_ITEMS = "sidebar.pinnedItems";
const CONTEXT_KEY_ANY_PINNED_ITEMS = "zeplin:sidebar:anyPinnedItems";

function getPinnedItems(): PinData[] {
    return ContextProvider.get().workspaceState.get(KEY_PINNED_ITEMS) ?? [];
}

function updateAnyPinnedItemsContext() {
    setContext(CONTEXT_KEY_ANY_PINNED_ITEMS, !!getPinnedItems().length);
}

function doesScreenMatchWithPinData(screen: Screen, item: PinData) {
    return item.type === PinType.Screen && (item as ScreenPinData).screen._id === screen._id;
}

function doesComponentMatchWithPinData(component: ResponseZeplinComponent, item: PinData) {
    return item.type === PinType.Component && (item as ComponentPinData).component._id === component._id;
}

function isScreenPinned(screen: Screen): boolean {
    return getPinnedItems().some(item => doesScreenMatchWithPinData(screen, item));
}

function isComponentPinned(component: ResponseZeplinComponent) {
    return getPinnedItems().some(item => doesComponentMatchWithPinData(component, item));
}

function addScreenToPinnedItems(screen: Screen, project: Barrel) {
    const pinnedItems = getPinnedItems();
    const newPinnedItems = pinnedItems.concat({
        type: PinType.Screen,
        screen,
        project
    } as ScreenPinData);
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function addComponentToPinnedItems(component: ResponseZeplinComponent, barrel: Barrel) {
    const pinnedItems = getPinnedItems();
    const newPinnedItems = pinnedItems.concat({
        type: PinType.Component,
        component,
        barrel
    } as ComponentPinData);
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function removeScreenFromPinnedItems(screen: Screen) {
    const pinnedItems = getPinnedItems();
    const newPinnedItems = pinnedItems.filter(item => !doesScreenMatchWithPinData(screen, item));
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function removeComponentFromPinnedItems(component: ResponseZeplinComponent) {
    const pinnedItems = getPinnedItems();
    const newPinnedItems = pinnedItems.filter(item => !doesComponentMatchWithPinData(component, item));
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

function removeAllFromPinnedItems() {
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, []);

    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
}

export {
    getPinnedItems,
    updateAnyPinnedItemsContext,
    isComponentPinned,
    isScreenPinned,
    addScreenToPinnedItems,
    addComponentToPinnedItems,
    removeScreenFromPinnedItems,
    removeComponentFromPinnedItems,
    removeAllFromPinnedItems
};
