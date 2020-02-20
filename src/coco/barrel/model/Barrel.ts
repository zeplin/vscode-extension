import BarrelType from "./BarrelType";

export default interface Barrel {
    id: string;
    name: string;
    type: BarrelType;
    platform: string;
    densityScale?: number;
    thumbnail?: string;
}
