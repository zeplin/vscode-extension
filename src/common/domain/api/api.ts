import Session from "../../../session/Session";
import fetch, { Headers } from "node-fetch";
import OrganizationsResponse from "../../../coco/barrel/model/OrganizationsResponse";
import ProjectsResponse from "../../../coco/barrel/model/ProjectsResponse";
import StyleguidesResponse from "../../../coco/barrel/model/StyleguidesResponse";
import ProjectDetailsResponse from "../../../coco/zeplinComponent/model/ProjectDetailsResponse";
import StyleguideDetailsResponse from "../../../coco/zeplinComponent/model/StyleguideDetailsResponse";
import BaseError from "../error/BaseError";
import BarrelType from "../barrel/BarrelType";
import configuration from "../extension/configuration";
import Logger from "../../../log/Logger";
import ScreensResponse from "../../../sidebar/screen/model/ScreensResponse";

const HEADER_KEY_CONTENT_TYPE = "Content-Type";
const HEADER_KEY_ACCESS_TOKEN = "Zeplin-Access-Token";
const HEADER_KEY_CHILD_PROJECT = "Zeplin-Project-Id";
const HEADER_KEY_CHILD_STYLEGUIDE = "Zeplin-Styleguide-Id";
const HEADER_VALUE_CONTENT_TYPE = "application/json";
const METHOD_GET = "GET";

type ApiResult<T> = Promise<T | BaseError>;

interface ApiError {
    title: string;
    message: string;
}

type HeaderContainer = { [key: string]: string };

async function get<T>(path: string, extraHeaders: HeaderContainer = {}): Promise<T | BaseError> {
    try {
        Logger.log(`fetching ${path}`);
        const headers = new Headers({
            [HEADER_KEY_CONTENT_TYPE]: HEADER_VALUE_CONTENT_TYPE,
            [HEADER_KEY_ACCESS_TOKEN]: (await Session.getToken())!,
            ...extraHeaders
        });

        const response = await fetch(configuration.apiUrl + path, {
            method: METHOD_GET,
            headers
        });
        if (!response.ok) {
            const error = await response.json() as ApiError;
            Logger.log(`failed ${path} Code: ${response.status} Title: ${error.title} Message: ${error.message}`);
            return new BaseError(error.title ?? error.message, response.status);
        } else {
            const success = await response.json() as T;
            Logger.log(`fetched: ${path}`);
            return success;
        }
    } catch (error) {
        Logger.error(`fetching ${path} failed`, error);
        return new BaseError();
    }
}

/**
 * Fetches user's organizations.
 */
function getOrganizations(): ApiResult<OrganizationsResponse> {
    return get("/public/vscodeextension/organizations");
}

/**
 * Fetches an organization's projects.
 * @param organizationId An organization id.
 */
function getOrganizationProjects(organizationId: string): ApiResult<ProjectsResponse> {
    return get(`/public/vscodeextension/organizations/${organizationId}/projects`);
}

/**
 * Fetches an organization's styleguides.
 * @param organizationId An organization id.
 */
function getOrganizationStyleguides(organizationId: string): ApiResult<StyleguidesResponse> {
    return get(`/public/vscodeextension/organizations/${organizationId}/styleguides`);
}

/**
 * Fetches user's personal projects.
 */
function getPersonalProjects(): ApiResult<ProjectsResponse> {
    return get(`/public/vscodeextension/projects`);
}

/**
 * Fetches user's personal styleguides.
 */
function getPersonalStyleguides(): ApiResult<StyleguidesResponse> {
    return get(`/public/vscodeextension/styleguides`);
}

/**
 * Fetches a project's details.
 * @param projectId A project id.
 */
function getProjectDetails(projectId: string): ApiResult<ProjectDetailsResponse> {
    return get(`/public/vscodeextension/projects/${projectId}`);
}

/**
 * Fetches a styleguide's details.
 * Note: childId and childType can be provided to get styleguide's details even if the user has not joined it.
 * @param styleguideId A styleguide id.
 * @param childId Id of a known child of the styleguide whose details are requested.
 * @param childType Barrel type of a known child of the styleguide whose details are requested.
 */
function getStyleguideDetails(styleguideId: string, childId?: string, childType?: BarrelType):
    ApiResult<StyleguideDetailsResponse> {
    const headers = childId ? {
        [childType === BarrelType.Project ? HEADER_KEY_CHILD_PROJECT : HEADER_KEY_CHILD_STYLEGUIDE]: childId
    } : {};

    return get(`/public/vscodeextension/styleguides/${styleguideId}`, headers);
}

/**
 * Fetches a project's screens.
 * @param projectId A project id
 */
function getScreens(projectId: string): ApiResult<ScreensResponse> {
    return get(`/public/vscodeextension/projects/${projectId}/screens`);
}

export {
    getOrganizations,
    getOrganizationProjects,
    getOrganizationStyleguides,
    getPersonalProjects,
    getPersonalStyleguides,
    getProjectDetails,
    getStyleguideDetails,
    getScreens
};
