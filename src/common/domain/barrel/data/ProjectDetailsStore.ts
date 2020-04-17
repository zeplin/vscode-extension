import { getProjectDetails } from "../../api/api";
import BarrelDetailsStore from "./BarrelDetailsStore";
import BarrelType from "../BarrelType";
import ProjectDetailsResponse from "../model/ProjectDetailsResponse";

export default class ProjectDetailsStore extends BarrelDetailsStore<ProjectDetailsResponse> {
    protected type = BarrelType.Project;

    protected fetchBarrelDetails = getProjectDetails;

    protected getParent(response: ProjectDetailsResponse): string | undefined {
        return response.styleguide;
    }
}
