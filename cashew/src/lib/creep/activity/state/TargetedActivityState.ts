import { ActivityState } from "./ActivityState";
import { ITargetedActivityState } from "./ITargetedActivityState";

export class TargetedActivityState extends ActivityState implements ITargetedActivityState {
    targetId: string | null;
    canFindNewTarget: boolean = true;
}

