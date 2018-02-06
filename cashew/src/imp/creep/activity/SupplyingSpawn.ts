import * as Settings from './Settings';
import { ISupplyingSpawnState } from "./state/ISupplyingSpawnState";

import { MultiTargetActivity } from "../../../lib/creep/activity/MultiTargetActivity";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { IMultiTargetActivityState } from "../../../lib/creep/activity/state/IMultiTargetActivityState";

import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { ActionType } from "../../../lib/creep/action/ActionType";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class SupplyingSpawn extends MultiTargetActivity<(StructureSpawn | StructureExtension)> {
    public static readonly id: string = "supplyingSpawn";

    private _invalidating: boolean;
    private _spawn: StructureSpawn;

    constructor(creep: Creep, spawnTarget: StructureSpawn) {
        super(creep, SupplyingSpawn.id, '#000000'); 
    }

    public state: ISupplyingSpawnState;

    public get spawn(): StructureSpawn {
        if (!this._spawn) {
            this._spawn = Game.getObjectById<StructureSpawn>(this.state.spawnId);
        }
        return this._spawn;
    }

    public set spawn(val: StructureSpawn) {
        this._spawn = val;
        this.state.spawnId = val.id;
    }

    /** Executes the main logic of the activity. */
    public execute(): ActivityResponse {
        //todo: refactor to use .findInRange        
        let actions: IActionResponse[] = [];

        while (true) {
            let transferResponse = this.creep.transfer(this.target, RESOURCE_ENERGY);
            actions.push({ type: ActionType.TRANSFER, result: transferResponse });

            if (transferResponse === ActionResult.OK) {
                this.findNewTarget();
                if (!this.currentTargetIsValid()) {
                    return new ActivityResponse(ActivityResult.OK, ActivityStatus.PREDICT_COMPLETE);
                }
            } else if (transferResponse === ActionResult.ERR_NOT_IN_RANGE) {
                return this.moveAndReturn(this.target, actions);
            } else {
                this.invalidate();
                if (!this.tryMakeValid()) {
                    return new ActivityResponse(ActivityResult.ERROR, ActivityStatus.OTHER, transferResponse);
                }
            }
        }
    }

    /** Invalidates the activity. Call this if the activity needs to be terminated without
        having the chance to complete. */
    public invalidate(): void {
        if (this._invalidating) {
            return;
        }

        this._invalidating = true;
        this.setTarget(null);
        this.setTargetArray([]);
        this._invalidating = false;
    }

    /** Called at the end of the tick. */
    public cleanup(): void {
    }

    /** Tries to correct itself and get to a valid state (find new target, etc.). Returns true if successful. */
    public tryMakeValid(): boolean {
        if (!this.creepIsValid()) {
            return false;
        }
        return this.findNewTarget();
    }


    protected onReset(): void {
    }

    /** Determines if the creep who owns the activity is in a valid state to continue working. */
    protected creepIsValid(): boolean {
        return this.creep.nut.energyAvailable >= Settings.CREEP_MIN_ENERGY;
    }

    /** Performs any other state checks that might be required to validate the activity. */
    protected otherStateIsValid(): boolean {
        return true;
    }
    
    /** Determines if a target is valid for initial assignment.
        @param target
        */
    protected targetIsValidForAssignment(target: (StructureSpawn | StructureExtension)): boolean {
        //todo: check with spawn
        return target.energyCapacity - target.energy >= Settings.FILL_THRESHOLD;
    }

    /** Determines if the current target is still valid.
        @param target
        */
    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;
        }
        //todo: check with spawn
        return this.target.energyCapacity - this.target.energy >= Settings.FILL_THRESHOLD;
    }
    
    /** Searches for a new target array and assigns it to activity.targetArray. Returns false
        if no array could be found. Resets the currentIndex and _canFindNewTarget if successful. */
    protected findNewTargetArray(): boolean {        
        if (!this.canFindNewTargetArray) {
            return false;
        }

        this.canFindNewTargetArray = false;

        this.spawn = this.creep.nut.home;

        var targets = this.spawn.nut.getEnergyTargets();
        targets = this.creep.nut.sortByRange(targets);        
        this.setTargetArray(targets);
        return targets.length > 0;
    }
    
    //public static LoadFromState(state: ISupplyingSpawnState): SupplyingSpawn {
    //    let activity = Object.create(SupplyingSpawn.prototype);
    //    activity.state = state;
    //    return activity;
    //}
}
