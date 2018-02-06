import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { TargetedActivity } from "../../../lib/creep/activity/TargetedActivity";
import { ITargetedActivityState } from "../../../lib/creep/activity/state/ITargetedActivityState";

import { ActionType } from "../../../lib/creep/action/ActionType";
import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class AttackingNearestEnemy extends TargetedActivity<Creep> {
    public static readonly id: string = "attackingNearestEnemy";

    constructor(creep: Creep) {
        super(creep, AttackingNearestEnemy.id, '#000000');        
    }
    

    public execute(): ActivityResponse {
        var attackResponse = this.creep.attack(this.target);
        var actions: IActionResponse[] = [];
        actions.push({ type: ActionType.ATTACK, result: attackResponse });

        if (attackResponse == ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else if (attackResponse == OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.WORKING);
        } else {
            return new ActivityResponse(
                ActivityResult.ERROR,
                ActivityStatus.OTHER,
                "Bad response - " + attackResponse.toString());
        }
    }

    public invalidate(): void {
    }

    public cleanup(): void {
    }

    public tryMakeValid(): boolean {
        if (!this.creepIsValid()) {
            return false;
        }

        return this.findNewTarget();
    }

    public onReset(): void {
    }

    // need at least one carry and one work to mine
    protected creepIsValid(): boolean {
        return true;
    }

    /** Performs any other state checks that might be required to validate the activity. */
    protected otherStateIsValid(): boolean {
        return true;
    }
    
    /** Determines if a target is valid for initial assignment. */
    protected targetIsValidForAssignment(target: Creep): boolean {
        return target && !target.my && target.room.name == this.creep.room.name;
    }

    /** Determines if the current target is still valid. */
    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;
        }

        return this.targetIsValidForAssignment(this.target);
    }

    /** Gets a new target and assigns it to activity.target. Returns true if a target was found. */
    protected findNewTarget(): boolean {
        var creeps = this.creep.room.nut.seed.findHostileCreeps();
        var sorted = this.creep.nut.sortByRange(creeps);
        for (var i = 0; i < sorted.length; i++) {
            if (this.targetIsValidForAssignment(sorted[i])) {
                this.setTarget(sorted[i]);
                return true;
            }
        }
        return false;
    }    
}
