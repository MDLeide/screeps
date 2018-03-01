import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";

export class HaulerRole extends Role {
    constructor() {
        super(CREEP_CONTROLLER_HAULER);
    }

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getCreepsColony(creep);

        if (creep.carry.energy > 0) {
            let transferTarget = colony.getTransferTarget(creep);
            if (transferTarget)
                return Task.Transfer(transferTarget);
        } else {
            let withdrawTarget = colony.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);
        }
        return null;
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }
}
