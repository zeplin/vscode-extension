import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import { hasRepository, addRepository } from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import RepositoryType from "../model/RepositoryType";
import localization from "../../../localization";

function startAddGithubFlow() {
    return startAddRepositoryFlow(RepositoryType.Github);
}

function startAddGitlabFlow() {
    return startAddRepositoryFlow(RepositoryType.Gitlab);
}

function startAddBitbucketFlow() {
    return startAddRepositoryFlow(RepositoryType.Bitbucket);
}

async function startAddRepositoryFlow(type: RepositoryType) {
    const configPath = await selectAndValidateConfig(localization.coco.repository.add(type), false);
    if (!configPath) {
        return;
    }

    if (hasRepository(configPath, type)) {
        MessageBuilder.with(localization.coco.repository.alreadyAdded(type)).show();
        showInEditor(configPath, { text: getRepositoryFieldName(type) });
        return;
    }

    addRepository(configPath, type);
    MessageBuilder.with(localization.coco.repository.added(type)).setType(MessageType.Info).show();
    showInEditor(configPath, { text: "", onAdd: true });
}

function getRepositoryFieldName(type: RepositoryType): string {
    switch (type) {
        case RepositoryType.Github:
            return "github";
        case RepositoryType.Gitlab:
            return "gitlab";
        case RepositoryType.Bitbucket:
            return "bitbucket";
        default:
            throw new Error(`Unhandled repository type: ${type}`);
    }
}

export {
    startAddGithubFlow,
    startAddGitlabFlow,
    startAddBitbucketFlow
};
