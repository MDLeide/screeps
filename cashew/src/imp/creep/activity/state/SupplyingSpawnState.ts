import { ISupplyingSpawnState } from "./ISupplyingSpawnState";
import { MultiTargetActivityState } from "../../../../lib/creep/activity/state/MultiTargetActivityState";

export class SupplyingSpawnState extends MultiTargetActivityState implements ISupplyingSpawnState {
    public spawnId: string;
}