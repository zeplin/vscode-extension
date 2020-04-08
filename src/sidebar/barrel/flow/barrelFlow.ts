import localization from "../../../localization";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import * as sidebarUtil from "../util/barrelUtil";
import { showNotLoggedInError } from "../../../common/domain/error/errorUi";
import Session from "../../../session/Session";
import { pickBarrel } from "../../../common/domain/barrel/flow/barrelFlow";

function startAddProjectToSidebarFlow() {
    return startAddBarrelToSidebarFlow(BarrelType.Project);
}
function startAddStyleguideToSidebarFlow() {
    return startAddBarrelToSidebarFlow(BarrelType.Styleguide);
}

async function startAddBarrelToSidebarFlow(type: BarrelType) {
    const title = localization.common.barrel.add(type);

    // Check if user is logged, fail if not so
    if (!Session.isLoggedIn()) {
        showNotLoggedInError();
        return;
    }

    // Pick barrel
    const barrel = await pickBarrel(title, type);

    // Fail if no barrel is selected
    if (!barrel) {
        return;
    }

    // Fail if barrel is already saved
    if (sidebarUtil.isBarrelSaved(barrel)) {
        MessageBuilder.with(localization.common.barrel.alreadyAdded(type)).show();
        // TODO: Highlight item in sidebar
        return;
    }

    // Add barrel
    sidebarUtil.saveBarrel(barrel);
    MessageBuilder.with(localization.sidebar.barrel.added(type)).setType(MessageType.Info).show();
    // TODO: Highlight item in sidebar
}

export {
    startAddProjectToSidebarFlow,
    startAddStyleguideToSidebarFlow
};
