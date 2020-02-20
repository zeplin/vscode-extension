import BarrelType from "../../../coco/barrel/model/BarrelType";
import configuration from "../extension/configuration";

function getProjectAppUrl(projectId: string): string {
    return `${configuration.appUrl}project?pid=${projectId}`;
}

function getProjectWebUrl(projectId: string): string {
    return `${configuration.webUrl}/project/${projectId}`;
}

function getStyleguideAppUrl(styleguideId: string): string {
    return `${configuration.appUrl}styleguide?stid=${styleguideId}`;
}

function getStyleguideWebUrl(styleguideId: string): string {
    return `${configuration.webUrl}/styleguide/${styleguideId}`;
}

function getBarrelAppUrl(barrelId: string, barrelType: BarrelType): string {
    return barrelType === BarrelType.Project ? getProjectAppUrl(barrelId) : getStyleguideAppUrl(barrelId);
}

function getBarrelWebUrl(barrelId: string, barrelType: BarrelType): string {
    return barrelType === BarrelType.Project ? getProjectWebUrl(barrelId) : getStyleguideWebUrl(barrelId);
}

function getComponentAppUrl(barrelId: string, barrelType: BarrelType, componentId: string): string {
    const barrelIdKey = barrelType === BarrelType.Project ? "pid" : "stid";
    return `${configuration.appUrl}components?coids=${componentId}&${barrelIdKey}=${barrelId}`;
}

function getComponentWebUrl(barrelId: string, barrelType: BarrelType, componentId: string): string {
    const styleguideLabel = barrelType === BarrelType.Project ? "/styleguide" : "";
    return `${getBarrelWebUrl(barrelId, barrelType)}${styleguideLabel}/components?coid=${componentId}`;
}

export {
    getBarrelAppUrl,
    getBarrelWebUrl,
    getComponentAppUrl,
    getComponentWebUrl
};
