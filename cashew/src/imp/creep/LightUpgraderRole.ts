import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";

/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class LightUpgraderRole extends Role {
    constructor() {
        super(CREEP_CONTROLLER_LIGHT_UPGRADER);
    }

    ///** If true, the creep will fill the spawn. */
    //public supplySpawn: boolean = true;    // not saving this to memory, so just hardcoding as 'true' for now

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.carry.energy == 0) {            
            let withdrawTarget = colony.resourceManager.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);
        } else if (creep.carry.energy > 0) {
            let spawnTarget = colony.resourceManager.getSpawnExtensionTransferTargets(creep);
            if (spawnTarget)
                return Task.Transfer(spawnTarget);

            let upgradeTarget = colony.nest.room.controller;
            return Task.Upgrade(upgradeTarget);
        }
        return null; 
    }

    protected isIdle(creep: Creep): Task {
        let colony = global.empire.getColonyByCreep(creep);
        if (creep.carry.energy > 0) {
            if (colony.nest.room.controller.ticksToDowngrade <= 2000)
                return Task.Upgrade(colony.nest.room.controller);            

            let spawnTarget = colony.resourceManager.getSpawnExtensionTransferTargets(creep);
            if (spawnTarget)
                return Task.Transfer(spawnTarget);

            return Task.Upgrade(colony.nest.room.controller);
        } else {
            let withdrawTarget = colony.resourceManager.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);
        }
        return null;
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }
}
