import Screen from "./Screen";

export default interface ScreenSection {
    id: string;
    name: string;
    description?: string;
    screens: Screen[];
}
