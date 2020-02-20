import Logger from "../Logger";

const NONSEQUENTIAL_OPERATION_MARKER = "################";

function wrapWithLogs<T>(method: () => T, logMarker: string, onlyExceptions = false): T {
    try {
        log(`${logMarker} started`, onlyExceptions);
        const result = method();
        log(`${logMarker} finished`, onlyExceptions);
        return result;
    } catch (error) {
        logError(logMarker, error);
        throw error;
    }
}

async function wrapWithLogsAsync<T>(method: () => Promise<T>, logMarker: string, onlyExceptions = false): Promise<T> {
    try {
        log(`${logMarker} started`, onlyExceptions);
        const result = await method();
        log(`${logMarker} finished`, onlyExceptions);
        return result;
    } catch (error) {
        logError(logMarker, error);
        throw error;
    }
}

function log(message: string, skip = false) {
    if (!skip) {
        Logger.log(`${NONSEQUENTIAL_OPERATION_MARKER} ${message}`);
    }
}

function logError(message: string, error: Error) {
    Logger.error(`${NONSEQUENTIAL_OPERATION_MARKER} ${message} failed`, error);
}

export {
    wrapWithLogs,
    wrapWithLogsAsync
};
