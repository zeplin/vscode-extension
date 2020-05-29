import ContextProvider from "../../../common/vscode/extension/ContextProvider";
import Screen from "../../screen/model/Screen";
import Barrel from "../../../common/domain/barrel/Barrel";
import PinType from "../model/PinType";
import ComponentPinData from "../model/ComponentPinData";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";
import ScreenPinData from "../model/ScreenPinData";
import { setContext } from "../../../common/vscode/ide/builtinCommands";
import BarrelTreeDataProvider from "../../barrel/tree/BarrelTreeDataProvider";
import PinTreeDataProvider from "../tree/PinTreeDataProvider";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import ResponseScreen from "../../screen/model/ResponseScreen";
import Analytics from "../../../analytics/Analytics";

const KEY_PINNED_ITEMS = "sidebar.pinnedItems";
const CONTEXT_KEY_ANY_PINNED_ITEMS = "zeplin:sidebar:anyPinnedItems";

type ConcretePinData = ScreenPinData | ComponentPinData;

function getPinnedItems(): ConcretePinData[] {
    return ContextProvider.get().workspaceState.get(KEY_PINNED_ITEMS) ?? [];
}

function isComponentPinData(item: ConcretePinData): item is ComponentPinData {
    return item.type === PinType.Component;
}

function isScreenPinData(item: ConcretePinData): item is ScreenPinData {
    return item.type === PinType.Screen;
}

function updateAnyPinnedItemsContext() {
    setContext(CONTEXT_KEY_ANY_PINNED_ITEMS, !!getPinnedItems().length);
}

function doesScreenMatchWithPinData(screen: Screen, item: ConcretePinData): boolean {
    return isScreenPinData(item) && item.screen._id === screen._id;
}

function doesComponentMatchWithPinData(component: ResponseZeplinComponent, item: ConcretePinData): boolean {
    return isComponentPinData(item) && item.component._id === component._id;
}

function isScreenPinned(screen: Screen): boolean {
    return getPinnedItems().some(item => doesScreenMatchWithPinData(screen, item));
}

function isComponentPinned(component: ResponseZeplinComponent) {
    return getPinnedItems().some(item => doesComponentMatchWithPinData(component, item));
}

function addScreenToPinnedItems(screen: Screen, project: Barrel) {
    if (isScreenPinned(screen)) {
        return;
    }

    const pinnedItems = getPinnedItems();
    const newPinnedItems = pinnedItems.concat({
        type: PinType.Screen,
        screen,
        barrel: project
    } as ScreenPinData);
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    Analytics.resourcePinned(PinType.Screen);
    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
    PinTreeDataProvider.revealScreen(screen);
}

function addComponentToPinnedItems(component: ResponseZeplinComponent, barrel: Barrel) {
    if (isComponentPinned(component)) {
        return;
    }

    const pinnedItems = getPinnedItems();
    const newPinnedItems = pinnedItems.concat({
        type: PinType.Component,
        component,
        barrel
    } as ComponentPinData);
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    Analytics.resourcePinned(PinType.Component);
    BarrelTreeDataProvider.refresh();
    PinTreeDataProvider.refresh();
    PinTreeDataProvider.revealComponent(component);
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

function removeBarrelItemsFromPinnedItems(barrel: Barrel) {
    const newPinnedItems = getPinnedItems().filter(item => item.barrel.id !== barrel.id);
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, newPinnedItems);

    PinTreeDataProvider.refresh();
}

function updatePinnedScreens(screens: ResponseScreen[]) {
    const pinnedItems = getPinnedItems();
    for (const item of pinnedItems) {
        if (isScreenPinData(item)) {
            const updatedScreen = screens.find(screen => screen._id === item.screen._id);
            if (updatedScreen) {
                Object.assign(item.screen, updatedScreen);
            }
        }
    }
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, pinnedItems);

    PinTreeDataProvider.refresh();
}

function updatePinnedItems(barrel: BarrelDetails) {
    const pinnedItems = getPinnedItems();
    for (const item of pinnedItems) {
        if (isComponentPinData(item)) {
            const updatedComponent = barrel.components.find(component => component._id === item.component._id);
            if (updatedComponent) {
                Object.assign(item.component, updatedComponent);
                Object.assign(item.barrel, barrel);
            }
        } else if (barrel.screenSections?.some(section => section.screens.includes(item.screen._id))) {
            Object.assign(item.barrel, barrel);
            item.screen.jiras = barrel.itemJiras.ofScreens.filter(jira => jira.itemId === item.screen._id);
        }
    }
    ContextProvider.get().workspaceState.update(KEY_PINNED_ITEMS, pinnedItems);

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
    removeAllFromPinnedItems,
    removeBarrelItemsFromPinnedItems,
    updatePinnedScreens,
    updatePinnedItems
};
