import ConfigPropertyHoverData from "../../../common/domain/hover/ConfigPropertyHoverData";
import Command from "../../../common/vscode/command/Command";
import localization from "../../../localization";
import RepositoryType from "../model/RepositoryType";
import AddGithubCommand from "../command/AddGithubCommand";
import AddGitlabCommand from "../command/AddGitlabCommand";
import AddBitbucketCommand from "../command/AddBitbucketCommand";

class RepositoryPropertyHoverData implements ConfigPropertyHoverData {
    public info = localization.coco.repository.propInfo(this.type);
    public optional = false;
    public properties: ConfigPropertyHoverData[] = [
        {
            key: "branch",
            info: localization.coco.repository.propBranchInfo(this.type),
            optional: true
        },
        {
            key: "repository",
            info: localization.coco.repository.propRepositoryInfo(this.type),
            optional: false
        },
        {
            key: "url",
            info: localization.coco.repository.propUrlInfo(this.url),
            optional: true
        }
    ];
    public command: { name: string; text: string };

    public constructor(private type: RepositoryType, public key: string, command: Command, private url: string) {
        this.command = {
            name: command.name,
            text: localization.coco.repository.add(type)
        };
    }
}

export default {
    ForGithub: new RepositoryPropertyHoverData(
        RepositoryType.Github, "github", AddGithubCommand, "https://github.com"
    ),
    ForGitlab: new RepositoryPropertyHoverData(
        RepositoryType.Gitlab, "gitlab", AddGitlabCommand, "https://gitlab.com"
    ),
    ForBitbucket: new RepositoryPropertyHoverData(
        RepositoryType.Bitbucket, "bitbucket", AddBitbucketCommand, "https://bitbucket.org"
    )
};
