import BarrelType from "../../barrel/BarrelType";
import configuration from "../../extension/configuration";
import ApplicationType from "../model/ApplicationType";

/**
 * Returns a project's Windows and Mac app uri.
 * @param projectId A project id.
 */
function getProjectAppUri(projectId: string): string {
    return `${configuration.appUri}project?pid=${projectId}`;
}

/**
 * Returns a project's Web app url.
 * @param projectId A project id.
 */
function getProjectWebUrl(projectId: string): string {
    return `${configuration.webUrl}/project/${projectId}`;
}

/**
 * Returns a styleguide's Windows and Mac app uri.
 * @param styleguideId A styleguides id.
 */
function getStyleguideAppUri(styleguideId: string): string {
    return `${configuration.appUri}styleguide?stid=${styleguideId}`;
}

/**
 * Returns a styleguide's Web app url.
 * @param styleguideId A styleguides id.
 */
function getStyleguideWebUrl(styleguideId: string): string {
    return `${configuration.webUrl}/styleguide/${styleguideId}`;
}

function getBarrelUri(barrelId: string, barrelType: BarrelType, applicationType: ApplicationType) {
    return applicationType === ApplicationType.Web
        ? getBarrelWebUrl(barrelId, barrelType)
        : getBarrelAppUri(barrelId, barrelType);
}

/**
 * Returns a barrel's Windows and Mac app uri.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 */
function getBarrelAppUri(barrelId: string, barrelType: BarrelType): string {
    return barrelType === BarrelType.Project ? getProjectAppUri(barrelId) : getStyleguideAppUri(barrelId);
}

/**
 * Returns a barrel's Web app url.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 */
function getBarrelWebUrl(barrelId: string, barrelType: BarrelType): string {
    return barrelType === BarrelType.Project ? getProjectWebUrl(barrelId) : getStyleguideWebUrl(barrelId);
}

function getComponentUri(
    barrelId: string, barrelType: BarrelType, componentId: string, applicationType: ApplicationType
) {
    return applicationType === ApplicationType.Web
        ? getComponentWebUrl(barrelId, barrelType, componentId)
        : getComponentAppUri(barrelId, barrelType, componentId);
}

/**
 * Returns a component's Windows and Mac app uri.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 * @param componentId A component id.
 */
function getComponentAppUri(barrelId: string, barrelType: BarrelType, componentId: string): string {
    const barrelIdKey = barrelType === BarrelType.Project ? "pid" : "stid";
    return `${configuration.appUri}components?coids=${componentId}&${barrelIdKey}=${barrelId}`;
}

/**
 * Returns a component's Web app url.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 * @param componentId A component id.
 */
function getComponentWebUrl(barrelId: string, barrelType: BarrelType, componentId: string): string {
    const styleguideLabel = barrelType === BarrelType.Project ? "/styleguide" : "";
    return `${getBarrelWebUrl(barrelId, barrelType)}${styleguideLabel}/components?coid=${componentId}`;
}

function getComponentSectionUri(
    barrelId: string, barrelType: BarrelType, componentSectionId: string, applicationType: ApplicationType
) {
    return applicationType === ApplicationType.Web
        ? getComponentSectionWebUrl(barrelId, barrelType, componentSectionId)
        : getComponentSectionAppUri(barrelId, barrelType, componentSectionId);
}

function getComponentSectionWebUrl(barrelId: string, barrelType: BarrelType, componentSectionId: string) {
    const styleguideLabel = barrelType === BarrelType.Project ? "/styleguide" : "";
    return `${getBarrelWebUrl(barrelId, barrelType)}${styleguideLabel}/components?seid=${componentSectionId}`;
}

function getComponentSectionAppUri(barrelId: string, barrelType: BarrelType, componentSectionId: string) {
    const barrelIdKey = barrelType === BarrelType.Project ? "pid" : "stid";
    return `${configuration.appUri}components?cseid=${componentSectionId}&${barrelIdKey}=${barrelId}`;
}

/**
 * Returns a screen's app uri
 * @param projectId A project id.
 * @param screenId A screen id.
 * @param applicationType Type of app to create uri of.
 */
function getScreenUri(projectId: string, screenId: string, applicationType: ApplicationType): string {
    return applicationType === ApplicationType.Web
        ? getScreenWebUrl(projectId, screenId)
        : getScreenAppUri(projectId, screenId);
}

/**
 * Returns a screen's Web app url
 * @param projectId A project id.
 * @param screenId A screen id.
 */
function getScreenWebUrl(projectId: string, screenId: string): string {
    return `${getProjectWebUrl(projectId)}/screen/${screenId}`;
}

/**
 * Returns a screen's Mac app uri
 * @param projectId A project id.
 * @param screenId A screen id.
 */
function getScreenAppUri(projectId: string, screenId: string): string {
    return `${configuration.appUri}screen?pid=${projectId}&sid=${screenId}`;
}

/**
 * Returns a screen section's app uri
 * @param projectId A project id.
 * @param screenSectionId A screen section id.
 * @param applicationType Type of app to create uri of.
 */
function getScreenSectionUri(projectId: string, screenSectionId: string, applicationType: ApplicationType): string {
    return applicationType === ApplicationType.Web
        ? getScreenSectionWebUrl(projectId, screenSectionId)
        : getScreenSectionAppUri(projectId, screenSectionId);
}

/**
 * Returns a screen section's Web app url
 * @param projectId A project id.
 * @param screenSectionId A screen section id.
 */
function getScreenSectionWebUrl(projectId: string, screenSectionId: string): string {
    return `${getProjectWebUrl(projectId)}?seid=${screenSectionId}`;
}

/**
 * Returns a screen section's Mac app uri
 * @param projectId A project id.
 * @param screenSectionId A screen section id.
 */
function getScreenSectionAppUri(projectId: string, screenSectionId: string): string {
    return `${configuration.appUri}project?pid=${projectId}&seid=${screenSectionId}`;
}

export {
    getBarrelUri,
    getBarrelAppUri,
    getBarrelWebUrl,
    getComponentUri,
    getComponentAppUri,
    getComponentWebUrl,
    getComponentSectionUri,
    getScreenUri,
    getScreenSectionUri
};
