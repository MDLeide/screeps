import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";

/**
 * Specialized job for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class LightUpgraderJob extends Job {
    public static readonly myName: string = "LightUpgraderController";

    constructor() {
        super(LightUpgraderJob.myName);
    }

    public supplySpawn: boolean = false;
    public filling: boolean = true;

    protected getNextTask(creep: Creep): Task {
        let colony = global.empire.getColony(creep);

        if (!this.currentTask ||
            this.currentTask.type == Task.TransferName ||
            this.currentTask.type == Task.UpgradeName) {
            
            let withdrawTarget = colony.getWithdrawTarget(creep);
            if (withdrawTarget)
                return Task.Withdraw(withdrawTarget);

        } else if (creep.carry.energy > 0) {
            if (this.supplySpawn) {
                let spawnTarget = colony.getSpawnTransferTarget(creep);
                if (spawnTarget)
                    return Task.Transfer(spawnTarget);
            }

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
            if (this.supplySpawn) {
                let spawnTarget = colony.getSpawnTransferTarget(creep);
                if (spawnTarget)
                    return Task.Transfer(spawnTarget);
            }

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
