import { ITargetedActivityState } from "./ITargetedActivityState";

export interface IMultiTargetActivityState extends ITargetedActivityState {
    currentIndex: number;
    targetArrayIds: string[];
    canFindNewTargetArray: boolean;
}