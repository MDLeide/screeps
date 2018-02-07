import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { TargetedActivity } from "../../../lib/creep/activity/TargetedActivity";
import { ITargetedActivityState } from "../../../lib/creep/activity/state/ITargetedActivityState";

import { ActionType } from "../../../lib/creep/action/ActionType";
import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class ChargingTower extends TargetedActivity<StructureTower> {
    public static readonly id: string = "chargingTower";

    constructor(creep: Creep) {        
        super(creep, ChargingTower.id, '#000000');// todo: supply an optional state object
    }

    // activity

    /**
    * Executes the main logic of the activity.
    */
    public execute(): ActivityResponse {
        var transferResponse = this.creep.transfer(this.target, RESOURCE_ENERGY);
        var actions: IActionResponse[] = [{ type: ActionType.TRANSFER, result: transferResponse }];

        if (transferResponse === ActionResult.OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.PREDICT_COMPLETE, null, actions);
        } else if (transferResponse === ActionResult.ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else if (transferResponse == ActionResult.ERR_INVALID_TARGET) {
            var target = (this.target == null || this.target == undefined) ? "null" : this.target.structureType;
            return new ActivityResponse(
                ActivityResult.ERROR,
                ActivityStatus.NO_VALID_TARGETS,
                `invalid target: ${target}`);
        } else {
            return new ActivityResponse(
                ActivityResult.ERROR,
                ActivityStatus.OTHER,
                "bad response: " + transferResponse.toString());
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
    
    protected creepIsValid(): boolean {        
        return this.creep.nut.energyAvailable > 0;
    }
    
    protected otherStateIsValid(): boolean {
        return true;
    }
    
    protected targetIsValidForAssignment(target: StructureTower) : boolean {
        return target.energy < 750;
    }
    
    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;
        }

        return (this.target.energy < 750);
    }
    
    protected findNewTarget(): boolean {
        var towers = this.creep.room.find<StructureTower>(FIND_MY_STRUCTURES,
            {
                filter: (struct: Structure) => {
                    if (struct.structureType == STRUCTURE_TOWER) {
                        return (struct as StructureTower).energy < 750;
                    };
                    return false;
                }
            });

        if (!towers || towers.length === 0) {
            this.setTarget(null);
            this.canFindNewTarget = false;
            return false;
        }

        if (towers.length > 1) {
            towers = this.creep.nut.sortByRange(towers);
        }

        this.setTarget(towers[0]);
        return true;
    }    
}
