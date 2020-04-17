import BasicStore from "../../../common/domain/store/BasicStore";
import { getScreens } from "../../../common/domain/api/api";
import ResponseScreen from "../model/ResponseScreen";
import ScreensResponse from "../model/ScreensResponse";
import BaseError from "../../../common/domain/error/BaseError";

export default class ScreensStore extends BasicStore<ScreensResponse, ResponseScreen[]> {
    public constructor(private projectId: string) {
        super();
    }

    protected fetchData(): Promise<ScreensResponse | BaseError> {
        return getScreens(this.projectId);
    }

    protected extractData(response: ScreensResponse): ResponseScreen[] {
        return response.screens;
    }
}
