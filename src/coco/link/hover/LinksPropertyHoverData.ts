import AddLinkCommand from "../command/AddLinkCommand";
import localization from "../../../localization";
import ConfigPropertyHoverData from "../../../common/domain/hover/ConfigPropertyHoverData";

class LinksPropertyHoverData implements ConfigPropertyHoverData {
    public key = "links";
    public info = localization.coco.link.propInfo;
    public optional = true;
    public properties: ConfigPropertyHoverData[] = [
        {
            key: "name",
            info: localization.coco.link.propNameInfo,
            optional: true
        },
        {
            key: "type",
            info: localization.coco.link.propTypeInfo,
            extraInfo: localization.coco.link.propTypeExtraInfo,
            optional: false
        },
        {
            key: "url",
            info: localization.coco.link.propUrlInfo,
            optional: false
        }
    ];
    public command = {
        name: AddLinkCommand.name,
        text: localization.coco.link.add
    };
}

export default new LinksPropertyHoverData();
