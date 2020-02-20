import { getOrganizationProjects } from "../../../common/domain/api/api";
import BarrelType from "../model/BarrelType";
import BarrelStore from "./BarrelStore";
import ResponseBarrel from "../model/ResponseBarrel";
import ProjectsResponse from "../model/ProjectsResponse";
import BaseError from "../../../common/domain/error/BaseError";

export default class OrganizationProjectsStore extends BarrelStore<ProjectsResponse> {
    protected type = BarrelType.Project;

    public constructor(private id: string) {
        super();
    }

    protected fetchData(): Promise<ProjectsResponse | BaseError> {
        return getOrganizationProjects(this.id);
    }

    protected extractBarrels(response: ProjectsResponse): ResponseBarrel[] {
        return response.projects;
    }
}
