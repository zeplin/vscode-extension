import { getPersonalProjects } from "../../../common/domain/api/api";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import BarrelStore from "./BarrelStore";
import ResponseBarrel from "../model/ResponseBarrel";
import ProjectsResponse from "../model/ProjectsResponse";

export default class PersonalProjectsStore extends BarrelStore<ProjectsResponse> {
    protected type = BarrelType.Project;

    protected fetchData = getPersonalProjects;

    protected extractBarrels(response: ProjectsResponse): ResponseBarrel[] {
        return response.projects;
    }
}
