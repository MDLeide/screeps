import { CreepController } from "../../lib/creep/CreepController";
import { Role } from "../../lib/creep/Role";
import { Task } from "../../lib/creep/Task";


/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class UpgraderRole extends Role {
    public static fromMemory(memory: UpgraderRoleMemory): CreepController {
        let upgrader = new this(memory.containerId, memory.controllerId);
        return Role.fromMemory(memory, upgrader);
    }

    constructor(containerId: string, controllerId: string) {
        super(CREEP_CONTROLLER_UPGRADER);
        this.containerId = containerId;
        if (containerId)
            this.container = Game.getObjectById<StructureContainer>(containerId);
        this.controllerId = controllerId;
        if (controllerId)
            this.controller = Game.getObjectById<StructureController>(controllerId);
    }

    public controllerId: string;
    public controller: StructureController;
    public containerId: string;
    public container: StructureContainer;
    

    protected onLoad(): void {
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);
        if (this.controllerId)
            this.controller = Game.getObjectById<StructureController>(this.controllerId);
        super.onLoad();
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

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }

    protected onSave(): UpgraderRoleMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            controllerId: this.controllerId,
            containerId: this.containerId
        };
    }
}

export interface UpgraderRoleMemory extends RoleMemory {
    controllerId: string;
    containerId: string;
}
