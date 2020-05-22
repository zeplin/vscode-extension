import BasicStore from "../../../common/domain/store/BasicStore";
import { getScreens } from "../../../common/domain/api/api";
import ResponseScreen from "../model/ResponseScreen";
import ScreensResponse from "../model/ScreensResponse";
import BaseError from "../../../common/domain/error/BaseError";
import ScreensError from "../model/ScreensError";

export default class ScreensStore extends BasicStore<ScreensResponse, ResponseScreen[], ScreensError> {
    public constructor(private projectId: string) {
        super();
    }

    protected async fetchData(): Promise<ScreensResponse | ScreensError> {
        const result = await getScreens(this.projectId);
        return result instanceof BaseError
            ? new ScreensError(this.projectId, result.message, result.code)
            : result;
    }

    protected extractData(response: ScreensResponse): ResponseScreen[] {
        return response.screens;
    }
}
