import { CreepController } from "../../lib/creep/CreepController";

export class HarvesterController extends CreepController {
    public static fromMemory(memory: HarvesterControllerMemory): CreepController {
        var controller = new this(memory.containerOrLinkId, memory.sourceId);
        controller.arrived = memory.arrived;
        controller.repaired = memory.repaired;
        return CreepController.fromMemory(memory, controller);
    }

    constructor(containerId: string, sourceId: string) {
        super(CREEP_CONTROLLER_HARVESTER);
        this.containerOrLinkId = containerId;
        this.sourceId = sourceId;
    }

    public containerOrLink: (StructureContainer | StructureLink);
    public source: Source;
    public containerOrLinkId: string;
    public sourceId: string;
    public arrived: boolean;
    public repaired: boolean;

    protected onLoad(): void {
        this.containerOrLink = Game.getObjectById<(StructureContainer | StructureLink)>(this.containerOrLinkId);
        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.arrived && !this.repaired && this.containerOrLink && this.containerOrLink.hits >= this.containerOrLink.hitsMax - 10)
            this.repaired = true;
    }

    protected onExecute(creep: Creep): void {        
        if (this.repaired) {
            this.harvest(creep);
        } else if (this.arrived) {
            this.repair(creep);
        } else {
            if (this.containerOrLink.structureType == STRUCTURE_LINK) {
                if (creep.pos.getRangeTo(this.containerOrLink) > 1) {
                    creep.moveTo(this.containerOrLink);
                } else if (creep.pos.getRangeTo(this.source) > 1) {
                    creep.moveTo(this.source);
                } else {
                    this.arrived = true;
                    this.harvest(creep);
                }
            } else {
                if (creep.pos.getRangeTo(this.containerOrLink) > 0) {
                    creep.moveTo(this.containerOrLink);
                } else {
                    this.arrived = true;
                    this.harvest(creep);
                }
            }            
        }      
    }

    protected onCleanup(creep: Creep): void { }

    private repair(creep: Creep): void {
        let colony = global.empire.getCreepsColony(creep);

        if (creep.carry.energy >= 25) {
            if (creep.repair(this.containerOrLink) == OK)
                colony.resourceManager.ledger.registerRepair(
                    Math.min(creep.carry.energy, creep.getActiveBodyparts(WORK) * REPAIR_POWER));
        } else {
            if (creep.harvest(this.source) == OK)
                colony.resourceManager.ledger.registerHarvest(
                    creep.getActiveBodyparts(WORK) * HARVEST_POWER);
        }
    }

    private moving(creep: Creep): void {        
        creep.moveTo(this.containerOrLink);
    }
    
    private harvest(creep: Creep): void {
        let colony = global.empire.getCreepsColony(creep);

        if (creep.harvest(this.source) == OK)
            colony.resourceManager.ledger.registerHarvest(
                creep.getActiveBodyparts(WORK) * HARVEST_POWER);

        if (creep.carryCapacity - creep.carry.energy < creep.getActiveBodyparts(WORK) * 2)
            creep.transfer(this.containerOrLink, RESOURCE_ENERGY);
    }

    protected onSave(): HarvesterControllerMemory {
        return {
            type: this.type,
            arrived: this.arrived,
            containerOrLinkId: this.containerOrLinkId,
            sourceId: this.sourceId,
            repaired: this.repaired
        };
    }
}

export interface HarvesterControllerMemory extends CreepControllerMemory {
    arrived: boolean;
    containerOrLinkId: string;
    sourceId: string;
    repaired: boolean;
}
