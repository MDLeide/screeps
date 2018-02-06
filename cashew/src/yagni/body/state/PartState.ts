import { IPartState } from "./IPartState";
import { PartType } from "../PartType";

export class PartState implements IPartState {
    public type: PartType;
    public quantity: number;
}