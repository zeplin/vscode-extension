import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import { showNotLoggedInError, showBarrelError } from "../../../common/domain/error/errorUi";
import { getSavedBarrels } from "../../barrel/util/barrelUtil";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import localization from "../../../localization";
import { startAddProjectToSidebarFlow, startAddStyleguideToSidebarFlow } from "../../barrel/flow/barrelFlow";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";
import { getZeplinComponentDetailRepresentation } from "../../../common/domain/zeplinComponent/util/zeplinComponentUi";
import Session from "../../../session/Session";
import JumpablesStore, { Jumpable } from "../data/JumpableItemsStore";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import { getScreenDetailRepresentation } from "../../screen/util/screenUi";
import ZeplinUriProvider from "../../openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import { openInZeplin } from "../../openInZeplin/flow/openInZeplinFlow";
import { getScreenUri, getComponentUri } from "../../../common/domain/openInZeplin/util/zeplinUris";
import ZeplinLinkType from "../../openInZeplin/model/ZeplinLinkType";

async function startJumpToFlow() {
    // Check if user is logged, fail if not so
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    const savedBarrels = getSavedBarrels();

    // Fail if there is no saved barrels
    if (!savedBarrels.length) {
        MessageBuilder.with(localization.sidebar.common.noBarrelFound)
            .addOption(localization.common.barrel.add(BarrelType.Project), startAddProjectToSidebarFlow)
            .addOption(localization.common.barrel.add(BarrelType.Styleguide), startAddStyleguideToSidebarFlow)
            .addOption(localization.common.cancel)
            .show();
        return;
    }

    // Show jumpable picker
    const jumpableQuickPickProvider = new QuickPickProvider(
        JumpablesStore,
        jumpable => ({
            label: jumpable.name,
            detail: isComponent(jumpable)
                ? getZeplinComponentDetailRepresentation(jumpable, true)
                : getScreenDetailRepresentation(jumpable)
        }),
        localization.sidebar.jumpTo.noItemFound,
        showBarrelError
    );
    jumpableQuickPickProvider.get().title = localization.sidebar.jumpTo.jumpToItem;
    jumpableQuickPickProvider.get().placeholder = localization.sidebar.jumpTo.selectItem;
    const jumpable = await jumpableQuickPickProvider.startSingleSelection();

    // Fail if no jumpable is selected
    if (!jumpable) {
        return;
    }

    const uriProvider: ZeplinUriProvider = {
        getZeplinUri(applicationType: ApplicationType): string {
            return isComponent(jumpable)
                ? getComponentUri(jumpable.barrelId, jumpable.barrelType, jumpable._id, applicationType)
                : getScreenUri(jumpable.barrelId, jumpable._id, applicationType);
        },

        getZeplinLinkType(): ZeplinLinkType {
            return isComponent(jumpable) ? ZeplinLinkType.Component : ZeplinLinkType.Screen;
        }
    };

    openInZeplin(uriProvider);
}

/**
 * Determines whether given jumpable is screen or component
 * Note: As Screen and ZeplinComponent are interfaces instanceof check could not be used
 *
 * @param jumpable A screen or component
 */
function isComponent(jumpable: Jumpable): jumpable is ZeplinComponent {
    return "sectionNames" in jumpable;
}

export {
    startJumpToFlow
};
