import { TargetedActivityState } from "./TargetedActivityState";
import { IMultiTargetActivityState } from "./IMultiTargetActivityState";

export class MultiTargetActivityState extends TargetedActivityState implements IMultiTargetActivityState {
    currentIndex: number = -1;
    targetArrayIds: string[];
    canFindNewTargetArray: boolean = true;
}
