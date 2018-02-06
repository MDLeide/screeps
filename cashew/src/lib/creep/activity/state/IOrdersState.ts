import { IPhaseState } from "./IPhaseState";

export interface IOrdersState {
    phases: IPhaseState[];
    currentIndex: number;
    autoTryNextPhase: boolean;
    wrapPhases: boolean;
    invalid: boolean;
}