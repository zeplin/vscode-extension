import ApplicationType from "../../../common/domain/openInZeplin/model/ApplicationType";

export default interface ZeplinUriProvider {
    getZeplinUri(applicationType: ApplicationType): string;
}
