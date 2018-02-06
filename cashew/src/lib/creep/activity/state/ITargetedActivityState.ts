import { IActivityState } from "./IActivityState";

export interface ITargetedActivityState extends IActivityState {
    targetId: string | null;
    canFindNewTarget: boolean;
}