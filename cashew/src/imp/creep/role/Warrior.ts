import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { AttackingNearestEnemy } from "../activity/AttackingNearestEnemy";

export class Warrior extends Role {
    public static readonly id: string = "warrior";

    constructor(creep: Creep) {        
        super(creep, Warrior.id);        
    }
    
    public onDeath(): void {
    }

    protected preIdleCheck(): void {
    }

    protected preActivityValidation(): void {        
    }

    protected preActivityExecution(activity: Activity): void {
        if (activity) {
        }
    }

    protected getNextActivity(): Activity {
        var attack = new AttackingNearestEnemy(this.creep);
        if (!attack.isValid()) {
            if (!attack.tryMakeValid()) {
                return null;
            }
        }
        return attack;
    }
        
    protected postActivityExecution(executionResponse: ActivityResponse): boolean {
        if (executionResponse) {
            //todo: suppress
        }        
        return false;
    }    
}
