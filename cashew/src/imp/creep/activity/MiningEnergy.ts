import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { TargetedActivity } from "../../../lib/creep/activity/TargetedActivity";
import { ITargetedActivityState } from "../../../lib/creep/activity/state/ITargetedActivityState";

import { ActionType } from "../../../lib/creep/action/ActionType";
import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class MiningEnergy extends TargetedActivity<Source> {
    public static readonly id: string = "miningEnergy";

    constructor(creep: Creep) {
        super(creep, MiningEnergy.id, '#000000');        
    }
    

    public execute(): ActivityResponse {
        var harvestResponse = this.creep.harvest(this.target);
        var actions: IActionResponse[] = [];
        actions.push({ type: ActionType.HARVEST, result: harvestResponse });

        if (harvestResponse == ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else if (harvestResponse == OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.WORKING);
        } else {
            return new ActivityResponse(ActivityResult.ERROR,
                ActivityStatus.OTHER,
                { 'harvestResponse': harvestResponse });
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
        let carry: boolean = false;
        let work: boolean = false;
        let move: boolean = false;
        for (var i = 0; i < this.creep.body.length; i++) {
            if (this.creep.body[i].type == WORK) {
                work = true;
            } else if (this.creep.body[i].type == CARRY) {
                carry = true;
            } else if (this.creep.body[i].type == MOVE) {
                move = true;
            }
            if (carry && work && move) {
                return this.creep.nut.carryCapacityAvailable > 0;
            }
        }
        return false;
    }

    /** Performs any other state checks that might be required to validate the activity. */
    protected otherStateIsValid(): boolean {
        return true;
    }
    
    /** Determines if a target is valid for initial assignment. */
    protected targetIsValidForAssignment(target: Source): boolean {
        if (target.energy <= 0) {
            return false;
        }

        var path = this.creep.room.findPath(this.creep.pos, target.pos);
        if (path.length > 0 && target.pos.isEqualTo(path[path.length - 1].x, path[path.length - 1].y)) {
            return true;
        }
        return false;  
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
        var sources = this.creep.room.nut.seed.findSources();
        var sorted = this.creep.nut.sortByRange(sources);
        for (var i = 0; i < sorted.length; i++) {
            if (this.targetIsValidForAssignment(sorted[i])) {
                this.setTarget(sorted[i]);
                return true;
            }
        }
        return false;
    }    
}
