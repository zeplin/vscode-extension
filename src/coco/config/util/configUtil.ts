import * as fs from "fs";
import * as path from "path";

import { Config } from "../model/Config";
import Barrel from "../../../common/domain/barrel/Barrel";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import Component from "../../component/model/Component";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import { flatten, sum, getActiveItem } from "../../../common/general/arrayUtil";
import { isBarrelIdFormatValid } from "../../../common/domain/barrel/util/barrelUtil";
import Logger from "../../../log/Logger";
import RepositoryType from "../../repository/model/RepositoryType";
import Repository from "../../repository/model/Repository";
import ConfigPaths from "./ConfigPaths";
import ConfigFolderPaths from "./ConfigFolderPaths";

const ENCODING = "utf8";
const SPACE_COUNT_IN_TAB = 4;

function getConfig(configPath: string): Config {
    return Object.assign(new Config(), JSON.parse(fs.readFileSync(configPath, ENCODING)));
}

function isConfigValid(configPath: string): boolean {
    try {
        getConfig(configPath);
        return true;
    } catch (error) {
        Logger.log(error);
        return false;
    }
}

function saveConfig(configPath: string, config: Config) {
    const directoryName = path.dirname(configPath);
    if (!fs.existsSync(directoryName)) {
        fs.mkdirSync(directoryName);
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, SPACE_COUNT_IN_TAB), ENCODING);
}

function getBarrels(configPath: string) {
    const config = getConfig(configPath);
    const projects = config.getProjects().map(project => ({
        id: project,
        type: BarrelType.Project
    }));
    const styleguides = config.getStyleguides().map(styleguide => ({
        id: styleguide,
        type: BarrelType.Styleguide
    }));
    return [...projects, ...styleguides];
}

function hasBarrelsWithValidFormat(configPath: string): boolean {
    return getBarrels(configPath).some(({ id }) => isBarrelIdFormatValid(id));
}

function getActiveBarrel(configPath: string) {
    return getActiveItem(getBarrels(configPath));
}

function containsBarrel(configPath: string, barrel: Barrel): boolean {
    return getConfig(configPath).containsBarrel(barrel.type, barrel.id);
}

function addBarrel(configPath: string, barrel: Barrel) {
    const config = getConfig(configPath);
    config.addBarrel(barrel.type, barrel.id);
    return saveConfig(configPath, config);
}

function hasComponents(configPath: string): boolean {
    return getConfig(configPath).getComponents().length > 0;
}

function getComponent(configPath: string, componentIndex?: number): Component | undefined {
    const components = getConfig(configPath).getComponents();
    return componentIndex !== undefined && componentIndex >= 0 && componentIndex < components.length
        ? components[componentIndex]
        : undefined;
}

function getComponentsWithPath(filePath: string): Component[] {
    if (!ConfigPaths.hasForItem(filePath)) {
        return [];
    }

    const configPath = ConfigPaths.getForItem(filePath)!;
    const config = getConfig(configPath);
    return config.getComponentsWithRelativePath(ConfigFolderPaths.getRelativePathOf(filePath));
}

function isComponentAddedToConfig(filePath: string): boolean {
    return getComponentsWithPath(filePath).length > 0;
}

function getAllComponentPaths(): string[] {
    return flatten(
        ConfigFolderPaths
            .getAllWithConfig()
            .map(rootPath => getConfig(ConfigFolderPaths.getConfigOf(rootPath))
                .getComponents()
                .map(component => path.join(rootPath, component.path))
            )
    );
}

function getActiveComponent(configPath: string): Component | undefined {
    return getActiveItem(getConfig(configPath).getComponents());
}

function containsComponent(filePath: string): boolean {
    const configPath = ConfigPaths.getForItem(filePath);
    const config = getConfig(configPath);
    const componentPath = ConfigFolderPaths.getRelativePathOf(filePath);
    return config.containsComponent(componentPath);
}

function addComponentWithPath(filePath: string) {
    const configPath = ConfigPaths.getForItem(filePath);
    const config = getConfig(configPath);
    const componentPath = ConfigFolderPaths.getRelativePathOf(filePath);
    config.addComponentWithRelativePath(componentPath);
    return saveConfig(configPath, config);
}

function containsZeplinComponent(component: Component, zeplinComponent: ZeplinComponent): boolean {
    return component.zeplinNames.includes(zeplinComponent.name);
}

function addZeplinComponent(configPath: string, componentRelativePath: string, zeplinComponentName: string) {
    const config = getConfig(configPath);
    config.addZeplinComponent(componentRelativePath, zeplinComponentName);
    return saveConfig(configPath, config);
}

function addZeplinComponents(configPath: string, componentRelativePath: string, zeplinComponentNames: string[]) {
    const config = getConfig(configPath);
    zeplinComponentNames.forEach(name => config.addZeplinComponent(componentRelativePath, name));
    return saveConfig(configPath, config);
}

function getZeplinComponentsOfComponent(configPath: string, componentRelativePath: string): string[] {
    const config = getConfig(configPath);
    const components = config.getComponentsWithRelativePath(componentRelativePath);
    return flatten(components.map(component => component.zeplinNames));
}

function getZeplinComponentsCountOfComponent(filePath: string): number {
    return sum(getComponentsWithPath(filePath).map(component => component.zeplinNames.length));
}

function hasRepository(configPath: string, type: RepositoryType) {
    return getConfig(configPath).hasRepository(type);
}

function addRepository(configPath: string, type: RepositoryType, repository: Repository) {
    const config = getConfig(configPath);
    config.addRepository(type, repository);
    return saveConfig(configPath, config);
}

function addPlugin(configPath: string) {
    const config = getConfig(configPath);
    config.addPlugin();
    return saveConfig(configPath, config);
}

function addLink(configPath: string) {
    const config = getConfig(configPath);
    config.addLink();
    return saveConfig(configPath, config);
}

export {
    getConfig,
    isConfigValid,
    saveConfig,
    hasBarrelsWithValidFormat,
    getActiveBarrel,
    containsBarrel,
    addBarrel,
    hasComponents,
    getComponent,
    isComponentAddedToConfig,
    getAllComponentPaths,
    getActiveComponent,
    containsComponent,
    addComponentWithPath,
    containsZeplinComponent,
    addZeplinComponent,
    addZeplinComponents,
    getZeplinComponentsOfComponent,
    getZeplinComponentsCountOfComponent,
    hasRepository,
    addRepository,
    addPlugin,
    addLink
};
