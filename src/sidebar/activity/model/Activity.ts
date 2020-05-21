import User from "../../../common/domain/componentLike/model/User";
import Version from "../../../common/domain/componentLike/model/Version";
import { getDateAgo } from "../util/activityUi";
import ZeplinUriProvider from "../../openInZeplin/model/ZeplinUriProvider";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";
import ZeplinLinkType from "../../openInZeplin/model/ZeplinLinkType";

export default abstract class Activity implements ZeplinUriProvider {
    public date: Date;
    public dateAgo: string;
    public user?: User;

    public constructor(public itemName: string, version: Version) {
        this.date = new Date(version.created);
        this.dateAgo = getDateAgo(this.date);
        this.user = version.creator;
    }

    public abstract getZeplinUri(applicationType: ApplicationType): string;

    public abstract getZeplinLinkType(): ZeplinLinkType;
}
