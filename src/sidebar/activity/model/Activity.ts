import User from "../../../common/domain/componentLike/model/User";
import Version from "../../../common/domain/componentLike/model/Version";
import { getDateAgo } from "../util/activityUi";
import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";

export default abstract class Activity {
    public date: Date;
    public dateAgo: string;
    public user?: User;

    public constructor(public itemName: string, version: Version) {
        this.date = new Date(version.created);
        this.dateAgo = getDateAgo(this.date);
        this.user = version.creator;
    }

    public abstract getZeplinUrl(applicationType: ApplicationType): string;
}
