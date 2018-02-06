import { Activity } from "../../../lib/creep/activity/Activity";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { Role } from "../../../lib/creep/role/Role";
import { IRoleState } from "../../../lib/creep/role/state/IRoleState";
import { HeavyUpgraderState } from "./state/HeavyUpgraderState";
import { IHeavyUpgraderState } from "./state/IHeavyUpgraderState";
import { UpgradingController } from "../activity/UpgradingController";
import { WithdrawingEnergy } from "../activity/WithdrawingEnergy";

export class LightUpgrader extends Role {
    public static readonly id: string = "lightUpgrader";


    constructor(creep: Creep) {
        super(creep, LightUpgrader.id, new HeavyUpgraderState());
    }


    public state: IHeavyUpgraderState;

    
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
        if (this.creep.nut.carryCapacityAvailable > 0) {
            return new WithdrawingEnergy(this.creep);
        } else {
            return new UpgradingController(this.creep);
        }
    }
        
    protected postActivityExecution(executionResponse: ActivityResponse): boolean {
        if (executionResponse) {
            //todo: suppress
        }        
        return false;
    }
}
