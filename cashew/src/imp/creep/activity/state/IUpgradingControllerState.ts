import { IMultiTargetActivityState } from "../../../../lib/creep/activity/state/IMultiTargetActivityState";

export interface IUpgradingControllerState extends IMultiTargetActivityState {
    spawnId: string;
    containerId: string;
}