import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { WithdrawingEnergy } from "../activity/WithdrawingEnergy";
import { BuildingStructure } from "../activity/BuildingStructure";
import { PickingEnergy } from "../activity/PickingEnergy";
import { RepairingStructures } from "../activity/RepairingStructures";

export class Repairer extends Role {
    public static readonly id: string = "repairer";

    constructor(creep: Creep) {
        super(creep, Repairer.id);
    }
    
    public onDeath(): void {
    }
        
    protected preIdleCheck(): void {
    }

    protected preActivityValidation(): void {
    }

    protected getNextActivity(): Activity {
        if (this.creep.nut.carryTotal > 35) {
            return new RepairingStructures(this.creep);
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
