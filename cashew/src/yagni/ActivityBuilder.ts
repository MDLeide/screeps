//import { Activity } from "../../lib/creep/activity/Activity";

//import { IActivityState } from "../../lib/creep/activity/state/IActivityState";
//import { ITargetedActivityState } from "../../lib/creep/activity/state/ITargetedActivityState";
//import { IMultiTargetActivityState } from "../../lib/creep/activity/state/IMultiTargetActivityState";

//import { ActivityResponse } from "../../lib/creep/activity/ActivityResponse";
//import { ActivityResult } from "../../lib/creep/activity/ActivityResult";
//import { ActivityStatus } from "../../lib/creep/activity/ActivityStatus";

//import { ActionType } from "../../lib/creep/action/ActionType";
//import { ActionResult } from "../../lib/creep/action/ActionResult";
//import { IActionResponse } from "../../lib/creep/action/IActionResponse";

//import { EmptyActivity } from "../../lib/creep/activity/EmptyActivity";

//import { WithdrawingEnergy } from "./activity/WithdrawingEnergy";
//import { SupplyingSpawn } from "./activity/SupplyingSpawn";
//import { SupplyingController } from "./activity/SupplyingController";
//import { ChargingTower } from "./activity/ChargingTower";

//import { ISupplyingSpawnState } from "./activity/state/ISupplyingSpawnState";

//// todo: refactor builders/loaders
//// todo: registration system for concrete activites

//export class ActivityBuilder {
//    public static LoadFromState(state: IActivityState): Activity {
//        if (state.id === 'withdrawingEnergy') {
//            if (this.StateIsMultiActivity(state)) {
//                return WithdrawingEnergy.LoadFromState(state);
//            }
//        } else if (state.id === 'supplyingSpawn') {
//            if (this.StateIsSupplySpawn(state)) {
//                return SupplyingSpawn.LoadFromState(state);
//            }
//        } else if (state.id === 'supplyingController') {
//            if (this.StateIsTargetedActivity(state)) {
//                return SupplyingController.LoadFromState(state);
//            }
//        } else if (state.id === 'chargingTower') {
//            if (this.StateIsTargetedActivity(state)) {
//                return ChargingTower.LoadFromState(state);
//            }
//        } else if (state.id === 'idle') {
//            return EmptyActivity.LoadFromState(state);
//        }

//        throw new Error('argument out of range');
//    }

//    //public static GetNew(creep: Creep, id: string): Activity {                
//    //    if (id === 'withdrawingEnergy') {
//    //        return new WithdrawingEnergy(creep);
//    //    } else if (id === 'supplyingSpawn') {
//    //        return new SupplyingSpawn(creep);
//    //    } else if (id === 'supplyingController') {
//    //        return new SupplyingController(creep);
//    //    } else if (id === 'chargingTower') {
//    //        return new ChargingTower(creep);
//    //    } else {            
//    //        throw new Error('argument out of range');
//    //    }
//    //}

//    //todo: this is so lame

//    private static StateIsMultiActivity(state: IActivityState): state is IMultiTargetActivityState {
//        if (state) {
//        }
//        return true;
//    }

//    private static StateIsSupplySpawn(state: IActivityState): state is ISupplyingSpawnState {
//        if (state) {
//        }
//        return true;
//    }

//    private static StateIsTargetedActivity(state: IActivityState): state is ITargetedActivityState {
//        if (state) {
//        }
//        return true;
//    }
//}
