import Workspace from "../model/Workspace";
import * as api from "../../api/api";
import BasicStore from "../../store/BasicStore";
import localization from "../../../../localization";
import OrganizationsResponse from "../model/OrganizationsResponse";

class WorkspacesStore extends BasicStore<OrganizationsResponse, Workspace[]> {
    protected fetchData = api.getOrganizations;

    protected extractData(response: OrganizationsResponse): Workspace[] {
        return [
            { name: localization.coco.barrel.personalWorkspace },
            ...response.organizations
        ];
    }
}

export default new WorkspacesStore();
