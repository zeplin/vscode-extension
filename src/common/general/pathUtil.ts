import { unknownToLowercaseStringArray } from "./arrayUtil";
import { replaceAll } from "./stringUtil";

/**
 * Unix path separator.
 */
const PATH_SEPARATOR = "/";
/**
 * Windows path separator.
 */
const PATH_SEPARATOR_WINDOWS = "\\";
/**
 * File extension separator.
 */
const EXTENSION_SEPARATOR = ".";

/**
 * Converts a path to Unix path.
 * @param path A path.
 */
function toUnixPath(path: string): string {
    return replaceAll(path, PATH_SEPARATOR_WINDOWS, PATH_SEPARATOR);
}

/**
 * Removes a path's first character if it is Unix or Windows path seperator.
 * @param path A path.
 */
function removeLeadingPathSeparator(path: string): string {
    return path.length && (path.startsWith(PATH_SEPARATOR) || path.startsWith(PATH_SEPARATOR_WINDOWS))
        ? path.substring(1)
        : path;
}

/**
 * Turns path(s) object to lowercase and unix path array.
 * @param paths Path(s) to be normalized.
 */
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
