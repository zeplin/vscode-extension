import ApplicationType from "./ApplicationType";
import ZeplinLinkType from "./ZeplinLinkType";

export default interface ZeplinUriProvider {
    getZeplinUri(applicationType: ApplicationType): string;

    getZeplinLinkType(): ZeplinLinkType;
}
