import * as vscode from "vscode";
import Store from "../../domain/store/Store";
import localization from "../../../localization/localization";
import Result from "../../domain/store/Result";
import BaseError from "../../domain/error/BaseError";
import { showGeneralError } from "../../domain/error/errorUi";
import Logger from "../../../log/Logger";
import ContextProvider from "../extension/ContextProvider";

export default class QuickPickProvider<T, E extends BaseError = BaseError> {
    private quickPick: vscode.QuickPick<vscode.QuickPickItem>;
    private dataItems?: T[];

    public constructor(
        private store: Store<T[], E>,
        private mapItem: (data: T) => vscode.QuickPickItem,
        private noItemsMessage: string = localization.common.noItemFound,
        private handleError: (error: E) => void = showGeneralError
    ) {
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.quickPick = vscode.window.createQuickPick();
        this.quickPick.matchOnDescription = true;
        this.quickPick.matchOnDetail = true;
        this.quickPick.onDidTriggerButton(this.handleButtonClick);
        QuickPickProvider.createRefreshButton();
    }

    public get() {
        return this.quickPick;
    }

    public async startSelection(): Promise<T | undefined> {
        this.block();
        this.quickPick.show();
        Logger.log(`Quick Pick shown: ${this.quickPick.placeholder}`);
        await this.prepareForSelection(this.store.get);
        return this.itemSelected(this.quickPick);
    }

    private block() {
        this.quickPick.busy = true;
        this.quickPick.enabled = false;
    }

    private async prepareForSelection(getDataFunction: () => Promise<Result<T[], E>>) {
        const result = await getDataFunction();
        this.dataItems = result.data || [];
        Logger.log(`Quick Pick item count: ${this.dataItems.length}`);
        const pickerItems = this.dataItems.length
            ? this.dataItems.map(this.mapItem)
            : [QuickPickProvider.getEmptyListItem(this.noItemsMessage)];

        result.errors?.forEach(error => this.handleError(error));

        this.quickPick.items = pickerItems;
        this.quickPick.buttons = [QuickPickProvider.refreshButton];
        this.quickPick.busy = false;
        this.quickPick.enabled = true;
    }

    private handleButtonClick(button: vscode.QuickInputButton) {
        if (button === QuickPickProvider.refreshButton) {
            this.refreshData();
        }
    }

    private async refreshData() {
        Logger.log("Quick Pick items refreshing");
        this.block();
        this.quickPick.items = [];
        this.quickPick.buttons = [];
        await this.prepareForSelection(this.store.refresh);
    }

    private itemSelected(quickPick: vscode.QuickPick<vscode.QuickPickItem>): Promise<T | undefined> {
        return new Promise<T | undefined>(resolve => {
            quickPick.onDidAccept(() => {
                const selectedItem = quickPick.selectedItems[0];
                if (!selectedItem) {
                    Logger.log("Quick Pick dismissed");
                    resolve(undefined);
                } else if (selectedItem.detail === localization.common.clickToRefresh) {
                    this.refreshData();
                    return;
                } else {
                    const selectedIndex = this.quickPick.items.indexOf(selectedItem);
                    Logger.log(`Quick Pick item selected with index ${selectedIndex}`);
                    resolve(this.dataItems![selectedIndex]);
                }
                quickPick.dispose();
            });
            quickPick.onDidHide(() => resolve(undefined));
        });
    }

    private static refreshButton: vscode.QuickInputButton;

    private static createRefreshButton() {
        QuickPickProvider.refreshButton = QuickPickProvider.refreshButton ?? {
            iconPath: {
                light: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/light/icon-refresh.svg")),
                dark: vscode.Uri.file(ContextProvider.get().asAbsolutePath("resources/dark/icon-refresh.svg"))
            },
            tooltip: localization.common.refresh
        };
    }

    private static getEmptyListItem(label: string): vscode.QuickPickItem {
        return {
            label,
            detail: localization.common.clickToRefresh
        };
    }
}
