import { IPhaseState } from "./IPhaseState";

export class PhaseState implements IPhaseState {
    name: string;
    currentIndex: number = -1;
    activityIds: string[];
    invalid: boolean = false;
}