import { CreepController } from "../../lib/creep/CreepController";
import { Task } from "../../lib/creep/Task";


/**
 * Specialized role for the early parts of a room. Upgrades the controller by getting
energy from a container. Also keeps the Spawn fed.
 */
export class UpgraderController extends CreepController {
    public static fromMemory(memory: UpgraderRoleMemory): CreepController {
        let upgrader = new this(memory.containerId, memory.controllerId, memory.linkId);
        upgrader.repaired = memory.repaired;
        return CreepController.fromMemory(memory, upgrader);
    }


    constructor(containerId: string, controllerId: string, linkId: string) {
        super(CREEP_CONTROLLER_UPGRADER);
        this.containerId = containerId;
        if (containerId)
            this.container = Game.getObjectById<StructureContainer>(containerId);
        this.controllerId = controllerId;
        if (controllerId)
            this.controller = Game.getObjectById<StructureController>(controllerId);
        this.linkId = linkId;
        if (linkId)
            this.link = Game.getObjectById<StructureLink>(linkId);
    }


    public repaired: boolean;
    public controllerId: string;
    public controller: StructureController;
    public containerId: string;
    public container: StructureContainer;
    public linkId: string;
    public link: StructureLink;
    

    protected onLoad(): void {
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);
        if (this.controllerId)
            this.controller = Game.getObjectById<StructureController>(this.controllerId);
        if (this.linkId)
            this.link = Game.getObjectById<StructureLink>(this.linkId);
    }
    

    protected onUpdate(creep: Creep): void {
        if (!this.repaired && this.container && this.container.hits >= this.container.hitsMax - 10)
            this.repaired = true;
    }


    protected onExecute(creep: Creep): void {
        let workCount = creep.getActiveBodyparts(WORK);

        if (creep.carry.energy < workCount * 2) {
            let withdrawTarget: WithdrawTarget;

            if (this.link && this.link.energy >= workCount * 10)
                withdrawTarget = this.link;
            else if (this.container && this.container.store.energy >= workCount * 10)
                withdrawTarget = this.container;

            if (withdrawTarget) {
                if (creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdrawTarget);
                    return;
                }                
            }
        }

        if (this.repaired) {
            if (creep.upgradeController(this.controller) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.controller);
        } else {
            if (creep.repair(this.container) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.container);
        }    
    }

    protected onCleanup(creep: Creep): void {
    }

    protected onSave(): UpgraderRoleMemory {
        return {
            type: this.type,            
            controllerId: this.controllerId,
            containerId: this.containerId,
            linkId: this.linkId,
            repaired: this.repaired
        };
    }
}

export interface UpgraderRoleMemory extends CreepControllerMemory {
    repaired: boolean;
    controllerId: string;
    containerId: string;
    linkId: string;
}
