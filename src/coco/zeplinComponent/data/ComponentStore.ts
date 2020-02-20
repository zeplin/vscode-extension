import Store from "../../../common/domain/store/Store";
import { getConfig } from "../../config/util/configUtil";
import Component from "../../component/model/Component";
import Result from "../../../common/domain/store/Result";

export class ComponentStore implements Store<Component[]> {
    public constructor(private configPath: string) { }

    public get = (): Promise<Result<Component[]>> => Promise.resolve({
        data: getConfig(this.configPath).getComponents()
    });

    public refresh = this.get;
}
