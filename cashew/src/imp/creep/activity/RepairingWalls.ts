import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { TargetedActivity } from "../../../lib/creep/activity/TargetedActivity";
import { ITargetedActivityState } from "../../../lib/creep/activity/state/ITargetedActivityState";

import { ActionType } from "../../../lib/creep/action/ActionType";
import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class RepairingWalls extends TargetedActivity<StructureWall | StructureRampart> {
    public static readonly id: string = "repairingWalls";

    constructor(creep: Creep) {
        super(creep, RepairingWalls.id, '#000000');        
    }
    
    public execute(): ActivityResponse {
        var response = this.creep.repair(this.target);
        var actions: IActionResponse[] = [{ type: ActionType.BUILD, result: response }];

        if (response == ActionResult.ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else if (response == ActionResult.OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.WORKING, null, actions);
        } else {
            return new ActivityResponse(ActivityResult.ERROR, ActivityStatus.OTHER, this.target, actions);
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

    // need at least one carry and one work to build
    // also need some energy
    protected creepIsValid(): boolean {        
        let carry: boolean = false;
        let work: boolean = false;
        for (var i = 0; i < this.creep.body.length; i++) {
            if (this.creep.body[i].type == WORK) {
                work = true;
            } else if (this.creep.body[i].type == CARRY) {
                carry = true;
            }

            if (carry && work) {
                return this.creep.nut.energyAvailable > 0;
            }
        }
        return false
    }

    /** Performs any other state checks that might be required to validate the activity. */
    protected otherStateIsValid(): boolean {
        return true;
    }
    
    protected targetIsValidForAssignment(target: StructureWall | StructureRampart) : boolean {
        return target && target.hits < 5000;
    }

    /** Determines if the current target is still valid. */
    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;
        }
        return this.target.hits < 5000;
    }

    /** Gets a new target and assigns it to activity.target. Returns true if a target was found. */
    protected findNewTarget(): boolean {
        if (!this.canFindNewTarget) {
            return false
        }

        var walls = this.creep.room.find<StructureWall | StructureRampart>(FIND_STRUCTURES, {
            filter: (struct: Structure) => {
                return struct.structureType == STRUCTURE_WALL || struct.structureType == STRUCTURE_RAMPART;
            }
        });

        if (!walls.length) {
            return false;
        }

        var min = walls[0].hitsMax;
        var target = walls[0];

        for (var i = 0; i < walls.length; i++) {
            if (walls[i].hits < min) {
                min = walls[i].hits;
                target = walls[i];
            }
        }

        this.setTarget(target);
        return true;
    }

    

    //public static LoadFromState(state: ITargetedActivityState): BuildingStructure {
    //    let activity = Object.create(BuildingStructure.prototype);
    //    activity.state = state;        
    //    return activity;
    //}
}
