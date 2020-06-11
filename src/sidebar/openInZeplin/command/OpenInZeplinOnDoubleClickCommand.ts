import Command from "../../../common/vscode/command/Command";
import { openInZeplin } from "../../../common/domain/openInZeplin/flow/openInZeplinFlow";
import ZeplinUriProvider from "../../../common/domain/openInZeplin/model/ZeplinUriProvider";

const DOUBLE_CLICK_DURATION = 500;

class OpenInZeplinOnDoubleClickCommand implements Command {
    public name = "zeplin.sidebar.openInZeplinOnDoubleClick";
    private lastClickTime?: number;
    private lastClickedItem?: ZeplinUriProvider;

    public execute(uriProvider: ZeplinUriProvider) {
        if (
            this.lastClickTime && this.lastClickedItem && this.lastClickedItem === uriProvider &&
            this.lastClickTime > Date.now() - DOUBLE_CLICK_DURATION
        ) {
            this.lastClickTime = undefined;
            this.lastClickedItem = undefined;
            return openInZeplin(uriProvider);
        } else {
            this.lastClickTime = Date.now();
            this.lastClickedItem = uriProvider;
            return Promise.resolve();
        }
    }
}

export default new OpenInZeplinOnDoubleClickCommand();
