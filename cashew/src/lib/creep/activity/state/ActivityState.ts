import { IActivityState } from "./IActivityState";

export class ActivityState implements IActivityState {
    creepId: string;
    id: string;
    color: string;
    isInvalid: boolean = false;
}