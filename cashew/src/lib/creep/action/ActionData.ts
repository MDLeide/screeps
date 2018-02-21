import { ActionType } from "./ActionType";

//todo: action data
export class ActionData {
    public name: string;
    public type: ActionType;
    public description: string;
    //todo: move class to resolve circular depend.
    // requiredParts: [partToQuantity:Part]:number;
}
