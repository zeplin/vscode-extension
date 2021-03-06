import BarrelType from "../../../common/domain/barrel/BarrelType";
import Component from "../../component/model/Component";
import { flatten, isFirstOccurence } from "../../../common/general/arrayUtil";
import Repository from "../../repository/model/Repository";
import RepositoryType from "../../repository/model/RepositoryType";
import Plugin from "../../plugin/model/Plugin";
import Link from "../../link/model/Link";
import ZeplinComponentDescriptors from "../../../common/domain/zeplinComponent/model/ZeplinComponentDescriptors";
import { isBarrelIdFormatValid } from "../../../common/domain/barrel/util/barrelUtil";

export class Config {
    [key: string]: unknown; // This index signature is defined to be able to delete properties by string keys

    private projects?: string[];
    private styleguides?: string[];
    private components?: Component[];
    private github?: Repository;
    private gitlab?: Repository;
    private bitbucket?: Repository;
    private plugins?: Plugin[];
    private links?: Link[];

    public constructor(forCreation = false) {
        // Do not initialize items when accessing an existent config for not changing properties order.
        if (forCreation) {
            this.projects = [];
            this.styleguides = [];
            this.components = [];
        }
    }

    public hasBarrelsField(): boolean {
        return !!this.projects || !!this.styleguides;
    }

    public getBarrels(type: BarrelType): string[] {
        return type === BarrelType.Project ? this.getProjects() : this.getStyleguides();
    }

    public getProjects(): string[] {
        return this.projects || [];
    }

    public getStyleguides(): string[] {
        return this.styleguides || [];
    }

    public getValidBarrelsWithTypes(): { id: string; type: BarrelType }[] {
        return [
            ...this.getProjects().filter(isFirstOccurence).filter(isBarrelIdFormatValid)
                .map(id => ({ id, type: BarrelType.Project })),
            ...this.getStyleguides().filter(isFirstOccurence).filter(isBarrelIdFormatValid)
                .map(id => ({ id, type: BarrelType.Styleguide }))
        ];
    }

    public containsBarrel(type: BarrelType, id: string): boolean {
        return this.getBarrels(type).includes(id);
    }

    public addBarrel(type: BarrelType, id: string) {
        if (type === BarrelType.Project) {
            this.projects = this.getProjects().concat(id);
        } else {
            this.styleguides = this.getStyleguides().concat(id);
        }
    }

    public getComponents(): Component[] {
        return this.components || [];
    }

    public getComponentsWithRelativePath(relativePath: string): Component[] {
        return this.getComponents().filter(component => component.path === relativePath);
    }

    public containsComponent(relativePath: string): boolean {
        return this.getComponents().some(component => component.path === relativePath);
    }

    public addComponent(component: Component) {
        this.components = this.getComponents().concat(component);
    }

    public addComponentWithRelativePath(relativePath: string) {
        const idsPreferred = this.isZeplinComponentIdsPreferred();
        this.addComponent({
            path: relativePath,
            zeplinIds: idsPreferred ? [] : undefined,
            zeplinNames: idsPreferred ? undefined : []
        });
    }

    public removeComponent(component: Component) {
        this.components = this.getComponents().filter(current => current !== component);
    }

    public isZeplinComponentIdsPreferred() {
        const { zeplinIds = [], zeplinNames = [] } = this.getAllZeplinComponentDescriptors();
        return zeplinIds.length || !zeplinNames.length;
    }

    public addZeplinComponentIds(componentRelativePath: string, ids: string[]) {
        const component = this.getComponents().find(current => current.path === componentRelativePath)!;
        component.zeplinIds = [...component.zeplinIds ?? [], ...ids];
    }

    public addZeplinComponentNames(componentRelativePath: string, names: string[]) {
        const component = this.getComponents().find(current => current.path === componentRelativePath)!;
        component.zeplinNames = [...component.zeplinNames ?? [], ...names];
    }

    public getAllZeplinComponentNames(): string[] {
        return flatten(this.getComponents().map(component => component.zeplinNames));
    }

    public getAllZeplinComponentDescriptors(): Required<ZeplinComponentDescriptors> {
        const components = this.getComponents();
        return {
            zeplinIds: flatten(components.map(({ zeplinIds }) => zeplinIds)),
            zeplinNames: flatten(components.map(({ zeplinNames }) => zeplinNames))
        };
    }

    public hasRepository(type: RepositoryType): boolean {
        switch (type) {
            case RepositoryType.Github:
                return !!this.github;
            case RepositoryType.Gitlab:
                return !!this.gitlab;
            case RepositoryType.Bitbucket:
                return !!this.bitbucket;
            default:
                throw new Error(`Unhandled repository type: ${type}`);
        }
    }

    public addRepository(type: RepositoryType, repository: Repository) {
        switch (type) {
            case RepositoryType.Github:
                this.github = repository;
                break;
            case RepositoryType.Gitlab:
                this.gitlab = repository;
                break;
            case RepositoryType.Bitbucket:
                this.bitbucket = repository;
                break;
            default:
                throw new Error(`Unhandled repository type: ${type}`);
        }
    }

    public getPlugins(): Plugin[] {
        return this.plugins ?? [];
    }

    public addPlugin() {
        if (!this.plugins) {
            /* This code block adds "plugins as the first property (if it is not already added). This makes "plugins"
            property appear at the top of the config file when it is first added. Steps:
            1) Delete all properties
            2) Define "plugins" property
            3) Re-add all properties */
            const tempConfig = { ...this };
            Object.keys(this).forEach(key => delete this[key]);
            this.plugins = [];
            Object.assign(this, tempConfig);
        }
        this.plugins.push({
            name: ""
        } as Plugin);
    }

    public getLinks(): Link[] {
        return this.links ?? [];
    }

    public addLink() {
        this.links = this.getLinks().concat({
            type: "",
            url: ""
        } as Link);
    }
}
