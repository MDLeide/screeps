import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";

/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class UpgraderRole extends Role {
    constructor(containerId: string, controllerId: string) {
        super(CREEP_CONTROLLER_UPGRADER);
        this.containerId = containerId;
        this.controllerId = controllerId;
    }

    public controllerId: string;
    public controller: StructureController;
    public containerId: string;
    public container: StructureContainer;
    

    protected onLoad(creep: Creep): void {
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);
        if (this.controllerId)
            this.controller = Game.getObjectById<StructureController>(this.controllerId);
        super.onLoad(creep);
    }

    protected getNextTask(creep: Creep): Task {        
        if (!this.currentTask || this.currentTask.type == TASK_UPGRADE) {
            if (this.container && this.container.store.energy > 0)
                return Task.Withdraw(this.container);
        } else if (creep.carry.energy > 0) {
            return Task.Upgrade(this.controller);
        }
        return null;
    }

    protected isIdle(creep: Creep): Task {
        if (creep.carry.energy > 0) {
            return Task.Upgrade(this.controller);
        } else {
            if (this.container && this.container.store.energy > 0)
                return Task.Withdraw(this.container);
        }
        return null;
    }
}
