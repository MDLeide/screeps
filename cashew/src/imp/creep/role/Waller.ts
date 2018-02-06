import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { WithdrawingEnergy } from "../activity/WithdrawingEnergy";
import { RepairingWalls } from "../activity/RepairingWalls";
import { PickingEnergy } from "../activity/PickingEnergy";

export class Waller extends Role {
    public static readonly id: string = "waller";

    constructor(creep: Creep) {
        super(creep, Waller.id);
    }
    
    public onDeath(): void {
    }
        
    protected preIdleCheck(): void {
    }

    protected preActivityValidation(): void {
    }

    protected getNextActivity(): Activity {
        if (this.creep.nut.carryTotal > 10) {
            return new RepairingWalls(this.creep);
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
