import RepositoryType from "../model/RepositoryType";
import Repository from "../model/Repository";
import { execSync } from "child_process";
import Logger from "../../../log/Logger";

const GET_GIT_REPOSITORY_COMMAND = "git config --local --get remote.origin.url";
const GIT_REPO_URL_SUFFIX = ".git";
const DOMAIN_GITHUB = "github.com";
const DOMAIN_GITLAB = "gitlab.com";
const DOMAIN_BITBUCKET = "bitbucket.org";
const CUSTOM_DOMAIN_REG_EXP_GITHUB = /github\.(.+)\.com/;
const SUFFIX_HTTPS = "https://";

function getRepositoryForType(rootFolderPath: string, type: RepositoryType): Repository {
    let fullUrl: string | undefined;
    try {
        fullUrl = execSync(GET_GIT_REPOSITORY_COMMAND, {
            cwd: rootFolderPath
        }).toString().trim();
    } catch (error) {
        Logger.error(`Getting git repository url failed`, error);
    }

    if (!fullUrl) {
        return getDefaultRepository();
    }

    if (fullUrl.endsWith(GIT_REPO_URL_SUFFIX)) {
        fullUrl = fullUrl.substring(0, fullUrl.length - GIT_REPO_URL_SUFFIX.length);
    }

    const defaultUrl = getDefaultUrlForType(type);
    const defaultUrlIndex = fullUrl.indexOf(defaultUrl);
    if (defaultUrlIndex >= 0) {
        const name = fullUrl.substring(defaultUrlIndex + defaultUrl.length + 1); // +1 is for the divider after domain
        return {
            repository: name
        };
    }

    const customDomainRegExp = getCustomDomainRegExpForType(type);
    const customUrl = customDomainRegExp?.exec(fullUrl)?.[0];
    if (customUrl) {
        const customUrlIndex = fullUrl.indexOf(customUrl);
        const name = fullUrl.substring(customUrlIndex + customUrl.length + 1); // +1 is for the divider after domain
        const fullCustomUrl = SUFFIX_HTTPS + customUrl;
        return {
            repository: name,
            url: fullCustomUrl
        };
    }

    return getDefaultRepository();
}

function getDefaultRepository(): Repository {
    return {
        repository: ""
    };
}

function getDefaultUrlForType(type: RepositoryType): string {
    switch (type) {
        case RepositoryType.Github:
            return DOMAIN_GITHUB;
        case RepositoryType.Gitlab:
            return DOMAIN_GITLAB;
        case RepositoryType.Bitbucket:
            return DOMAIN_BITBUCKET;
        default:
            throw new Error(`Unhandled repository type: ${type}`);
    }
}

function getCustomDomainRegExpForType(type: RepositoryType): RegExp | undefined {
    switch (type) {
        case RepositoryType.Github:
            return CUSTOM_DOMAIN_REG_EXP_GITHUB;
        default:
            return undefined;
    }
}

export {
    getRepositoryForType
};
