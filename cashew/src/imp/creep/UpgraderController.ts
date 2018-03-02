import { CreepController } from "../../lib/creep/CreepController";
import { Task } from "../../lib/creep/Task";


/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class UpgraderController extends CreepController {
    public static fromMemory(memory: UpgraderRoleMemory): CreepController {
        let upgrader = new this(memory.containerOrLinkId, memory.controllerId);
        upgrader.repaired = memory.repaired;
        return CreepController.fromMemory(memory, upgrader);
    }

    constructor(containerId: string, controllerId: string) {
        super(CREEP_CONTROLLER_UPGRADER);
        this.containerOrLinkId = containerId;
        if (containerId)
            this.containerOrLink = Game.getObjectById<StructureContainer>(containerId);
        this.controllerId = controllerId;
        if (controllerId)
            this.controller = Game.getObjectById<StructureController>(controllerId);
    }

    public repaired: boolean;
    public controllerId: string;
    public controller: StructureController;
    public containerOrLinkId: string;
    public containerOrLink: (StructureContainer | StructureLink);
    

    protected onLoad(): void {
        if (this.containerOrLinkId)
            this.containerOrLink = Game.getObjectById<StructureContainer>(this.containerOrLinkId);
        if (this.controllerId)
            this.controller = Game.getObjectById<StructureController>(this.controllerId);
    }

    protected getNextTask(creep: Creep): Task {
        if (!this.repaired) {
            if (creep.carry.energy < creep.carryCapacity) {
                let response = creep.withdraw(this.containerOrLink, RESOURCE_ENERGY);
                if (response == ERR_NOT_IN_RANGE)
                    return Task.MoveTo(this.containerOrLink);
            }
            return Task.Repair(this.containerOrLink);
        } else {
            if (creep.carry.energy > 0) {
                return Task.Upgrade(this.controller);
            } else {                
                return Task.Withdraw(this.containerOrLink);
            }
        }                
    }

    protected isIdle(creep: Creep): Task {
        if (creep.carry.energy > 0) {
            return Task.Upgrade(this.controller);
        } else {            
            return Task.Withdraw(this.containerOrLink);
        }
    }

    protected onUpdate(creep: Creep): void {
        if (!this.repaired && this.containerOrLink && this.containerOrLink.hits >= this.containerOrLink.hitsMax - 10)
            this.repaired = true;
    }


    protected onExecute(creep: Creep): void {        
        let workCount = 0;
        for (var i = 0; i < creep.body.length; i++)
            if (creep.body[i].type == WORK)
                workCount++;

        if (creep.carry.energy < workCount * 2)
            creep.withdraw(this.containerOrLink, RESOURCE_ENERGY);
        creep.upgradeController(this.controller);
    }

    protected onCleanup(creep: Creep): void {
    }

    protected onSave(): UpgraderRoleMemory {
        return {
            type: this.type,            
            controllerId: this.controllerId,
            containerOrLinkId: this.containerOrLinkId,
            repaired: this.repaired
        };
    }
}

export interface UpgraderRoleMemory extends CreepControllerMemory {
    repaired: boolean;
    controllerId: string;
    containerOrLinkId: string;
}
