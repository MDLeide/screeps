import { IPhaseState } from "./IPhaseState";
import { IOrdersState } from "./IOrdersState";

export class OrdersState implements IOrdersState {
    phases: IPhaseState[] = [];
    currentIndex: number = 0;
    autoTryNextPhase: boolean = false;
    wrapPhases: boolean = false;
    invalid: boolean = false;
}

