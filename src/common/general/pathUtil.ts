import { unknownToLowercaseStringArray } from "./arrayUtil";
import { replaceAll } from "./stringUtil";

const PATH_SEPARATOR = "/";
const PATH_SEPARATOR_WINDOWS = "\\";
const EXTENSION_SEPARATOR = ".";

function toUnixPath(path: string): string {
    return replaceAll(path, PATH_SEPARATOR_WINDOWS, PATH_SEPARATOR);
}

function removeLeadingPathSeparator(path: string): string {
    return path.length && (path.startsWith(PATH_SEPARATOR) || path.startsWith(PATH_SEPARATOR_WINDOWS))
        ? path.substring(1)
        : path;
}

function normalizePaths(paths: unknown): string[] {
    return unknownToLowercaseStringArray(paths).map(toUnixPath);
}

export {
    PATH_SEPARATOR,
    EXTENSION_SEPARATOR,
    toUnixPath,
    removeLeadingPathSeparator,
    normalizePaths
};
