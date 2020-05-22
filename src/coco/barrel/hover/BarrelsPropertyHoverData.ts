import ConfigPropertyHoverData from "../../../common/domain/hover/ConfigPropertyHoverData";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import AddProjectCommand from "../command/AddProjectCommand";
import AddStyleguideCommand from "../command/AddStyleguideCommand";
import Command from "../../../common/vscode/command/Command";
import localization from "../../../localization";

class BarrelsPropertyHoverData implements ConfigPropertyHoverData {
    public info = localization.coco.barrel.propInfo(this.type);
    public extraInfo = localization.coco.barrel.propExtraInfo(this.type);
    public optional = false;
    public command: { name: string; text: string };

    public constructor(private type: BarrelType, public key: string, command: Command) {
        this.command = {
            name: command.name,
            text: localization.common.barrel.add(type)
        };
    }
}

export default {
    ForProjects: new BarrelsPropertyHoverData(BarrelType.Project, "projects", AddProjectCommand),
    ForStyleguides: new BarrelsPropertyHoverData(BarrelType.Styleguide, "styleguides", AddStyleguideCommand)
};
