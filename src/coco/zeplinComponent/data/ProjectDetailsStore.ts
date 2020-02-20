import { getProjectDetails } from "../../../common/domain/api/api";
import BarrelDetailsStore from "./BarrelDetailsStore";
import BarrelType from "../../barrel/model/BarrelType";
import ProjectDetailsResponse from "../model/ProjectDetailsResponse";

export default class ProjectDetailsStore extends BarrelDetailsStore<ProjectDetailsResponse> {
    protected type = BarrelType.Project;

    protected fetchBarrelDetails = getProjectDetails;

    protected getParent(response: ProjectDetailsResponse): string | undefined {
        return response.styleguide;
    }
}
