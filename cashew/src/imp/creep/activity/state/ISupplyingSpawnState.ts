import { IMultiTargetActivityState } from "../../../../lib/creep/activity/state/IMultiTargetActivityState";

export interface ISupplyingSpawnState extends IMultiTargetActivityState {
    spawnId: string;
}