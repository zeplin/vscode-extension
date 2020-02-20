import AddPluginCommand from "../command/AddPluginCommand";
import localization from "../../../localization";
import ConfigPropertyHoverData from "../../../common/domain/hover/ConfigPropertyHoverData";

class PluginsPropertyHoverData implements ConfigPropertyHoverData {
    public key = "plugins";
    public info = localization.coco.plugin.propInfo;
    public extraInfo = localization.coco.plugin.propExtraInfo;
    public optional = true;
    public properties: ConfigPropertyHoverData[] = [
        {
            key: "name",
            info: localization.coco.plugin.propNameInfo,
            optional: false
        },
        {
            key: "config",
            info: localization.coco.plugin.propConfigInfo,
            optional: true
        }
    ];
    public command = {
        name: AddPluginCommand.name,
        text: localization.coco.plugin.add
    };
}

export default new PluginsPropertyHoverData();
