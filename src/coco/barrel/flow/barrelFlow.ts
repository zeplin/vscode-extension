import localization from "../../../localization";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import * as configUtil from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import { pickBarrel } from "../../../common/domain/barrel/flow/barrelFlow";

function startAddProjectFlow() {
    return startAddBarrelFlow(BarrelType.Project);
}
function startAddStyleguideFlow() {
    return startAddBarrelFlow(BarrelType.Styleguide);
}

async function startAddBarrelFlow(type: BarrelType) {
    const title = localization.common.barrel.add(type);

    // Validate login and select config, fail if a modifiable config is not selected
    const configPath = await selectAndValidateConfig(title);
    if (!configPath) {
        return;
    }

    // Picker barrel
    const barrel = await pickBarrel(title, type);

    // Fail if no barrel is selected
    if (!barrel) {
        return;
    }

    // Fail if config contains barrel
    if (configUtil.containsBarrel(configPath, barrel)) {
        MessageBuilder.with(localization.common.barrel.alreadyAdded(type)).show();
        showInEditor(configPath, { text: barrel.id });
        return;
    }

    // Add barrel
    configUtil.addBarrel(configPath, barrel);
    MessageBuilder.with(localization.coco.barrel.added(type)).setType(MessageType.Info).show();
    showInEditor(configPath, { text: barrel.id, onAdd: true });
}

export {
    startAddProjectFlow,
    startAddStyleguideFlow
};
