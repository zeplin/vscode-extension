import BarrelType from "../../barrel/BarrelType";
import configuration from "../../extension/configuration";
import ApplicationType from "../model/ApplicationType";

/**
 * Returns a project's Windows and Mac app url.
 * @param projectId A project id.
 */
function getProjectAppUrl(projectId: string): string {
    return `${configuration.appUrl}project?pid=${projectId}`;
}

/**
 * Returns a project's Web app url.
 * @param projectId A project id.
 */
function getProjectWebUrl(projectId: string): string {
    return `${configuration.webUrl}/project/${projectId}`;
}

/**
 * Returns a styleguide's Windows and Mac app url.
 * @param styleguideId A styleguides id.
 */
function getStyleguideAppUrl(styleguideId: string): string {
    return `${configuration.appUrl}styleguide?stid=${styleguideId}`;
}

/**
 * Returns a styleguide's Web app url.
 * @param styleguideId A styleguides id.
 */
function getStyleguideWebUrl(styleguideId: string): string {
    return `${configuration.webUrl}/styleguide/${styleguideId}`;
}

function getBarrelUrl(barrelId: string, barrelType: BarrelType, applicationType: ApplicationType) {
    return applicationType === ApplicationType.Web
        ? getBarrelWebUrl(barrelId, barrelType)
        : getBarrelAppUrl(barrelId, barrelType);
}

/**
 * Returns a barrel's Windows and Mac app url.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 */
function getBarrelAppUrl(barrelId: string, barrelType: BarrelType): string {
    return barrelType === BarrelType.Project ? getProjectAppUrl(barrelId) : getStyleguideAppUrl(barrelId);
}

/**
 * Returns a barrel's Web app url.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 */
function getBarrelWebUrl(barrelId: string, barrelType: BarrelType): string {
    return barrelType === BarrelType.Project ? getProjectWebUrl(barrelId) : getStyleguideWebUrl(barrelId);
}

function getComponentUrl(
    barrelId: string, barrelType: BarrelType, componentId: string, applicationType: ApplicationType
) {
    return applicationType === ApplicationType.Web
        ? getComponentWebUrl(barrelId, barrelType, componentId)
        : getComponentAppUrl(barrelId, barrelType, componentId);
}

/**
 * Returns a component's Windows and Mac app url.
 * @param barrelId A barrel id.
 * @param barrelType A barrel type.
 * @param componentId A component id.
 */
function getComponentAppUrl(barrelId: string, barrelType: BarrelType, componentId: string): string {
    const barrelIdKey = barrelType === BarrelType.Project ? "pid" : "stid";
    return `${configuration.appUrl}components?coids=${componentId}&${barrelIdKey}=${barrelId}`;
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

function getComponentSectionUrl(
    barrelId: string, barrelType: BarrelType, componentSectionId: string, applicationType: ApplicationType
) {
    return applicationType === ApplicationType.Web
        ? getComponentSectionWebUrl(barrelId, barrelType, componentSectionId)
        : getComponentSectionAppUrl(barrelId, barrelType, componentSectionId);
}

function getComponentSectionWebUrl(barrelId: string, barrelType: BarrelType, componentSectionId: string) {
    const styleguideLabel = barrelType === BarrelType.Project ? "/styleguide" : "";
    return `${getBarrelWebUrl(barrelId, barrelType)}${styleguideLabel}/components?seid=${componentSectionId}`;
}

function getComponentSectionAppUrl(barrelId: string, barrelType: BarrelType, componentSectionId: string) {
    const barrelIdKey = barrelType === BarrelType.Project ? "pid" : "stid";
    return `${configuration.appUrl}components?cseid=${componentSectionId}&${barrelIdKey}=${barrelId}`;
}

/**
 * Returns a screen's app url
 * @param projectId A project id.
 * @param screenId A screen id.
 * @param applicationType Type of app to create url of.
 */
function getScreenUrl(projectId: string, screenId: string, applicationType: ApplicationType): string {
    return applicationType === ApplicationType.Web
        ? getScreenWebUrl(projectId, screenId)
        : getScreenAppUrl(projectId, screenId);
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
 * Returns a screen's Mac app url
 * @param projectId A project id.
 * @param screenId A screen id.
 */
function getScreenAppUrl(projectId: string, screenId: string): string {
    return `${configuration.appUrl}screen?pid=${projectId}&sid=${screenId}`;
}

/**
 * Returns a screen section's app url
 * @param projectId A project id.
 * @param screenSectionId A screen section id.
 * @param applicationType Type of app to create url of.
 */
function getScreenSectionUrl(projectId: string, screenSectionId: string, applicationType: ApplicationType): string {
    return applicationType === ApplicationType.Web
        ? getScreenSectionWebUrl(projectId, screenSectionId)
        : getScreenSectionAppUrl(projectId, screenSectionId);
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
 * Returns a screen section's Mac app url
 * @param projectId A project id.
 * @param screenSectionId A screen section id.
 */
function getScreenSectionAppUrl(projectId: string, screenSectionId: string): string {
    return `${configuration.appUrl}project?pid=${projectId}&seid=${screenSectionId}`;
}

export {
    getBarrelUrl,
    getBarrelAppUrl,
    getBarrelWebUrl,
    getComponentUrl,
    getComponentAppUrl,
    getComponentWebUrl,
    getComponentSectionUrl,
    getScreenUrl,
    getScreenSectionUrl
};
