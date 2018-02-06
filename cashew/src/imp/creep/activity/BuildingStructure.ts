import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { TargetedActivity } from "../../../lib/creep/activity/TargetedActivity";
import { ITargetedActivityState } from "../../../lib/creep/activity/state/ITargetedActivityState";

import { ActionType } from "../../../lib/creep/action/ActionType";
import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class BuildingStructure extends TargetedActivity<ConstructionSite> {
    public static readonly id: string = "buildingStructure";

    constructor(creep: Creep) {
        super(creep, BuildingStructure.id, '#000000');        
    }
    
    public execute(): ActivityResponse {
        var buildResponse = this.creep.build(this.target);
        var actions: IActionResponse[] = [{ type: ActionType.BUILD, result: buildResponse }];

        if (buildResponse == ActionResult.ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else if (buildResponse == ActionResult.OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.WORKING, null, actions);
        } else {
            return new ActivityResponse(ActivityResult.ERROR, ActivityStatus.OTHER, this.target, actions);
        }
    }

    public setSite(site: ConstructionSite) {
        this.setTarget(site);
        this.canFindNewTarget = false;
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
    
    protected targetIsValidForAssignment(target: ConstructionSite) : boolean {
        return target && target.progress < target.progressTotal && target.my;
    }

    /** Determines if the current target is still valid. */
    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;
        }
        return this.target.progress < this.target.progressTotal && this.target.my;
    }

    /** Gets a new target and assigns it to activity.target. Returns true if a target was found. */
    protected findNewTarget(): boolean {
      if (!this.canFindNewTarget) {
        return false
      }

      var sites = this.creep.room.find(FIND_MY_CONSTRUCTION_SITES);
      if (sites.length == 0) {
        return false;
      }
      this.setTarget(sites[0]);
      return true;
    }

    

    //public static LoadFromState(state: ITargetedActivityState): BuildingStructure {
    //    let activity = Object.create(BuildingStructure.prototype);
    //    activity.state = state;        
    //    return activity;
    //}
}
