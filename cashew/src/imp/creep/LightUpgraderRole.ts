import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";

/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class LightUpgraderRole extends Role {
    constructor() {
        super(CONTROLLER_LIGHT_UPGRADER);
    }

    ///** If true, the creep will fill the spawn. */
    //public supplySpawn: boolean = true;    // not saving this to memory, so just hardcoding as 'true' for now

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getColony(creep);

        if (!this.currentTask ||
            this.currentTask.type == TASK_TRANSFER ||
            this.currentTask.type == TASK_UPGRADE) {
            
            let withdrawTarget = colony.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);

        } else if (creep.carry.energy > 0) {
            //if (this.supplySpawn) {
            let spawnTarget = colony.getSpawnTransferTarget(creep);
            if (spawnTarget)
                return Task.Transfer(spawnTarget);
            //}

            let upgradeTarget = colony.nest.room.controller;
            return Task.Upgrade(upgradeTarget);
        }
        // if no withdraw targets, or withdraw finished
        // and we have no energy for some reason
        return null; 
    }

    protected isIdle(creep: Creep): Task {
        let colony = global.empire.getColony(creep);
        if (creep.carry.energy > 0) {
            //if (this.supplySpawn) {
            let spawnTarget = colony.getSpawnTransferTarget(creep);
            if (spawnTarget)
                return Task.Transfer(spawnTarget);
            //}

            let upgradeTarget = colony.nest.room.controller;
            return Task.Upgrade(upgradeTarget);
        } else {
            let withdrawTarget = colony.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);
        }
        return null;
    }
}
