import ConfigPropertyHoverData from "../../../common/domain/hover/ConfigPropertyHoverData";
import localization from "../../../localization";
import RepositoryType from "../model/RepositoryType";

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

    public constructor(private type: RepositoryType, public key: string, private url: string) { }
}

export default {
    ForGithub: new RepositoryPropertyHoverData(RepositoryType.Github, "github", "https://github.com"),
    ForGitlab: new RepositoryPropertyHoverData(RepositoryType.Gitlab, "gitlab", "https://gitlab.com"),
    ForBitbucket: new RepositoryPropertyHoverData(RepositoryType.Bitbucket, "bitbucket", "https://bitbucket.org")
};
