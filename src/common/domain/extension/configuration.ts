declare let WPC__API_URL: string;
declare let WPC__APP_URI: string;
declare let WPC__WEB_URL: string;
declare let WPC__IMAGE_SERVER_URL: string;
declare let WPC__OAUTH_CLIENT_ID: string;
declare let WPC__CONSOLE_LOGS_ENABLED: string;
declare let WPC__MIXPANEL_TOKEN: string;

export default {
    /**
     * Zeplin API url.
     */
    apiUrl: WPC__API_URL,
    /**
     * Zeplin Windows and Mac app uri.
     */
    appUri: WPC__APP_URI,
    /**
     * Zepin Web app url.
     */
    webUrl: WPC__WEB_URL,
    /**
     * Zeplin image server url.
     */
    imageServerUrl: WPC__IMAGE_SERVER_URL,
    /**
     * Client id for OAuth authentication.
     */
    oauthClientId: WPC__OAUTH_CLIENT_ID,
    /**
     * Whether logs are enabled.
     */
    consoleLogsEnabled: WPC__CONSOLE_LOGS_ENABLED,
    /**
     * Mixpanel Token
     */
    mixpanelToken: WPC__MIXPANEL_TOKEN
};
