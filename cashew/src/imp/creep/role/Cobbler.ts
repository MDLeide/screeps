import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { WithdrawingEnergy } from "../activity/WithdrawingEnergy";
import { RepairingRoads } from "../activity/RepairingRoads";
import { PickingEnergy } from "../activity/PickingEnergy";

export class Cobbler extends Role {
    public static readonly id: string = "cobbler";

    constructor(creep: Creep) {
        super(creep, Cobbler.id);
    }
    
    public onDeath(): void {
    }
        
    protected preIdleCheck(): void {
    }

    protected preActivityValidation(): void {
    }

    protected getNextActivity(): Activity {
        if (this.creep.nut.carryTotal > 10) {
            return new RepairingRoads(this.creep);
        } else {
            var dropped = this.creep.room.find(FIND_DROPPED_RESOURCES);
            if (dropped.length) {
                return new PickingEnergy(this.creep);
            }

            return new WithdrawingEnergy(this.creep);
        }
    }

    protected preActivityExecution(activity: Activity): void {        
    }

    protected postActivityExecution(response: ActivityResponse) : boolean {
        return false;
    }
}
