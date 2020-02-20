import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import { addLink } from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import localization from "../../../localization";

async function startAddLinkFlow() {
    const configPath = await selectAndValidateConfig(localization.coco.link.add, false);
    if (!configPath) {
        return;
    }

    addLink(configPath);
    MessageBuilder.with(localization.coco.link.added).setType(MessageType.Info).show();
    showInEditor(configPath, { text: "", onAdd: true });
}

export {
    startAddLinkFlow
};
