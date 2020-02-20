import AddComponentCommand from "../command/AddComponentCommand";
import localization from "../../../localization";
import ConfigPropertyHoverData from "../../../common/domain/hover/ConfigPropertyHoverData";

class ComponentsPropertyHoverData implements ConfigPropertyHoverData {
    public key = "components";
    public info = localization.coco.component.propInfo;
    public optional = false;
    public properties: ConfigPropertyHoverData[] = [
        {
            key: "name",
            info: localization.coco.component.propNameInfo,
            optional: true
        }, {
            key: "path",
            info: localization.coco.component.propPathInfo,
            optional: false
        }, {
            key: "zeplinNames",
            info: localization.coco.component.propZeplinNamesInfo,
            optional: false
        }, {
            title: localization.coco.component.propCustomLinkTitle,
            info: localization.coco.component.propCustomLinkInfo,
            optional: true,
            properties: [{
                key: "urlPath",
                info: localization.coco.component.propCustomLinkUrlPathInfo,
                optional: false
            }]
        }, {
            key: "styleguidist",
            info: localization.coco.component.propStyleguidistInfo,
            optional: true,
            properties: [{
                key: "kind",
                info: localization.coco.component.propStyleguidistKindInfo,
                optional: false
            }]
        }, {
            key: "storybook",
            info: localization.coco.component.propStorybookInfo,
            extraInfo: localization.coco.component.propStorybookExtraInfo,
            optional: true,
            properties: [{
                key: "kind",
                info: localization.coco.component.propStorybookKindInfo,
                optional: false
            }, {
                key: "stories",
                info: localization.coco.component.propStorybookStoriesInfo,
                optional: true
            }]
        }
    ];
    public command = {
        name: AddComponentCommand.name,
        text: localization.coco.component.add
    };
}

export default new ComponentsPropertyHoverData();
