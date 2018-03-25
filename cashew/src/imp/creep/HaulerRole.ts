import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";

export class HaulerRole extends Role {
    constructor() {
        super(CREEP_CONTROLLER_HAULER);
    }

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.carry.energy > 0) {
            let transferTarget = colony.resourceManager.getTransferTarget(creep);
            if (transferTarget)
                return Task.Transfer(transferTarget);
        } else {
            let transferTarget = colony.resourceManager.getTransferTarget(creep);
            if (!transferTarget)
                return null;

            let pickupTarget = colony.resourceManager.getEnergyPickupTarget(creep);
            if (pickupTarget)
                return Task.PickupEnergy(pickupTarget);

            let withdrawTarget = colony.resourceManager.getWithdrawTarget(creep);            
            if (!withdrawTarget)
                return null;

            if (withdrawTarget.id == transferTarget.id)
                return null;
            
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
