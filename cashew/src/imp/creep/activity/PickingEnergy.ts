import { TargetedActivity } from "../../../lib/creep/activity/TargetedActivity";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ITargetedActivityState } from "../../../lib/creep/activity/state/ITargetedActivityState";
import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { ActionType } from "../../../lib/creep/action/ActionType";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";


export class PickingEnergy extends TargetedActivity<Resource> {
    public static readonly id: string = "pickingEnergy";

    constructor(creep: Creep) {        
        super(creep, PickingEnergy.id, '#000000'); // todo: supply an optional state object
    }

// activity

/**
* Executes the main logic of the activity.
*/
    public execute(): ActivityResponse {
        if (!this.target) {
            this.findNewTarget();
        }

        let response = this.creep.pickup(this.target);        
        let actions: IActionResponse[] = [];
        
        actions.push({ type: ActionType.WITHDRAW, result: response });

        if (response === ActionResult.ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else if (response === ActionResult.OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.PREDICT_COMPLETE);
        } else {
            return new ActivityResponse(
                ActivityResult.ERROR,
                ActivityStatus.OTHER,
                "bad response - " + response.toString());
        }
    }

/**
    * Invalidates the activity. Call this if the activity needs to be terminated without
    * having the chance to complete.
    */
    public invalidate(): void {        
        this.canFindNewTarget = false;
    }

/**
    * Called at the end of the tick.
    */
    public cleanup(): void {
    }

/**
    * Tries to correct itself and get to a valid state (find new target, etc.). Returns true if successful.
    */
    public tryMakeValid(): boolean {
        if (!this.creepIsValid()) {
            return false;
        }

        if (this.findNewTarget()) {
            return true;
        }
        return false;
    }

/**
    * Resets the activity to its default state, as if it had been just constructed.
    */
    public onReset(): void {

    }

/**
    * Determines if the creep who owns the activity is in a valid state to continue working.
    */
    protected creepIsValid(): boolean {
        return this.creep.nut.carryCapacityAvailable > 0;
    }

/**
    * Performs any other state checks that might be required to validate the activity.
    */
    protected otherStateIsValid(): boolean {
        return true;
    }
    
    /**
    * Determines if a target is valid for initial assignment.
    * @param target
    */
    protected targetIsValidForAssignment(target: Resource): boolean {
        return target && target.resourceType == RESOURCE_ENERGY;
    }

    /**
    * Determines if the current target is still valid.
    * @param target
    */
    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;
        }
        return true;
    }

    /**
    * Gets a new target and assigns it to activity.target. Returns true if a target was found.
    */
    protected findNewTarget(): boolean {
        var energy = this.creep.room.find(FIND_DROPPED_RESOURCES);
        if (energy.length) {            
            this.setTarget(energy[0]);
            return true;
        }
        this.setTarget(null);
        return false;  
    }    
}
