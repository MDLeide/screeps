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
        upgrader.repaired = memory.repaired;
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

    public repaired: boolean;
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
        if (!this.repaired) {
            if (creep.carry.energy < creep.carryCapacity) {
                let response = creep.withdraw(this.container, RESOURCE_ENERGY);
                if (response == ERR_NOT_IN_RANGE)
                    return Task.MoveTo(this.container);
            }
            return Task.Repair(this.container);
        } else {
            if (creep.carry.energy > 0) {
                return Task.Upgrade(this.controller);
            } else {
                if (this.container && this.container.store.energy > 0)
                    return Task.Withdraw(this.container);
            }

            if (!this.currentTask || this.currentTask.type == TASK_UPGRADE) {
                if (this.container && this.container.store.energy > 0)
                    return Task.Withdraw(this.container);
            } else if (creep.carry.energy > 0) {
                return Task.Upgrade(this.controller);
            }
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
        if (!this.repaired && this.container && this.container.hits >= this.container.hitsMax - 10)
            this.repaired = true;
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
            containerId: this.containerId,
            repaired: this.repaired
        };
    }
}

export interface UpgraderRoleMemory extends RoleMemory {
    repaired: boolean;
    controllerId: string;
    containerId: string;
}
