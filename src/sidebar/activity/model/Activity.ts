import User from "../../../common/domain/componentLike/model/User";
import Version from "../../../common/domain/componentLike/model/Version";
import { getDateAgo } from "../util/activityUtil";

export default class Activity {
    public date: Date;
    public dateAgo: string;
    public user: User;

    public constructor(public itemName: string, version: Version) {
        this.date = new Date(version.created);
        this.dateAgo = getDateAgo(this.date);
        this.user = version.creator;
    }
}
