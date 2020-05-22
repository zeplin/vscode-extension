import Mixpanel from "mixpanel";
import { decode } from "jsonwebtoken";
import { getExtensionVersion } from "../../common/vscode/extension/extensionUtil";
import Session from "../../session/Session";
import Logger from "../../log/Logger";
import configuration from "../../common/domain/extension/configuration";
import Preferences from "../../preferences/Preferences";

class MixpanelHelper {
    private readonly mixpanel = Mixpanel.init(configuration.mixpanelToken);

    public async track(event: string, additionalProperties?: Mixpanel.PropertyDict, callback?: Mixpanel.Callback) {
        if (!Preferences.EnableTelemetry.get()) {
            return;
        }

        const properties: Mixpanel.PropertyDict = {
            "Client": "VS Code extension",
            "Client Version": getExtensionVersion(),
            ...additionalProperties
        };

        if (Session.isLoggedIn()) {
            const token = (await Session.getToken())!;
            const decodedToken = decode(token) as { sub: string } | null;
            if (decodedToken) {
                const userId = decodedToken.sub;
                properties.distinct_id = userId;
                properties.$user_id = userId;
            }
        }

        this.mixpanel.track(
            event,
            properties,
            error => {
                callback?.(error);
                if (error) {
                    Logger.error(`Mixpanel event '${event}' could not be tracked`, error);
                }
            }
        );
    }
}

export default new MixpanelHelper();
