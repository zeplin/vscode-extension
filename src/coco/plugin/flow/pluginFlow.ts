import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import { addPlugin } from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import localization from "../../../localization";

async function startAddPluginFlow() {
    const configPath = await selectAndValidateConfig(localization.coco.plugin.add, false);
    if (!configPath) {
        return;
    }

    addPlugin(configPath);
    MessageBuilder.with(localization.coco.plugin.added).setType(MessageType.Info).show();
    showInEditor(configPath, { text: "", onAdd: true });
}

export {
    startAddPluginFlow
};
