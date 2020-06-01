import { selectAndValidateConfig } from "../../common/flow/commonFlow";
import { hasRepository, addRepository } from "../../config/util/configUtil";
import { showInEditor } from "../../../common/vscode/editor/editorUtil";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import RepositoryType from "../model/RepositoryType";
import localization from "../../../localization";
import { getRootFolderPathForFile } from "../../../common/vscode/workspace/workspaceUtil";
import { getRepositoryForType } from "../util/repositoryUtil";
import StaticStore from "../../../common/domain/store/StaticStore";
import QuickPickProvider from "../../../common/vscode/quickPick/QuickPickerProvider";

type RepositoryTypeLabel = { label: string; type: RepositoryType };

function getRepositoryTypeLabel(type: RepositoryType): RepositoryTypeLabel {
    return {
        label: localization.coco.repository.type(type),
        type
    };
}

async function startAddRepositoryFlow() {
    const repositoryTypeQuickPickProvider = new QuickPickProvider(
        new StaticStore([
            getRepositoryTypeLabel(RepositoryType.Github),
            getRepositoryTypeLabel(RepositoryType.Gitlab),
            getRepositoryTypeLabel(RepositoryType.Bitbucket)
        ]),
        ({ label }) => ({ label })
    );
    repositoryTypeQuickPickProvider.get().title = localization.coco.repository.add;
    repositoryTypeQuickPickProvider.get().placeholder = localization.coco.repository.selectType;
    const repositoryTypeLabel = await repositoryTypeQuickPickProvider.startSingleSelection();

    // Fail if no barrel type is selected
    if (!repositoryTypeLabel) {
        return;
    }

    const type = repositoryTypeLabel.type;

    // Select config, fail if a modifiable config is not selected
    const configPath = await selectAndValidateConfig(localization.coco.repository.add, false);
    if (!configPath) {
        return;
    }

    // Fail if selected repository type is already added to config
    if (hasRepository(configPath, type)) {
        MessageBuilder.with(localization.coco.repository.alreadyAdded(type)).show();
        showInEditor(configPath, { text: getRepositoryFieldName(type) });
        return;
    }

    const rootFolderPath = getRootFolderPathForFile(configPath);
    const repository = getRepositoryForType(rootFolderPath, type);
    addRepository(configPath, type, repository);
    MessageBuilder.with(localization.coco.repository.added(type)).setType(MessageType.Info).show();
    showInEditor(configPath, { text: repository.repository, onAdd: true });
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
    startAddRepositoryFlow
};
