import { CreepController } from "../../lib/creep/CreepController";

export class HarvesterController extends CreepController {
    public static fromMemory(memory: HarvesterControllerMemory): CreepController {
        var controller = new this(memory.sourceId, memory.containerId, memory.linkId);
        controller.arrived = memory.arrived;
        controller.repaired = memory.repaired;
        return CreepController.fromMemory(memory, controller);
    }

    constructor(sourceId: string, containerId: string, linkId: string) {
        super(CREEP_CONTROLLER_HARVESTER);        
        this.sourceId = sourceId;
        this.containerId = containerId;
        this.linkId = linkId;
    }

    public sourceId: string;
    public source: Source;

    public containerId: string;
    public container: StructureContainer;
    public linkId: string;
    public link: StructureLink;
    
    public arrived: boolean;
    public repaired: boolean;

    protected onLoad(): void {
        if (this.containerId)
            this.container = Game.getObjectById<StructureContainer>(this.containerId);
        if (this.linkId)
            this.link = Game.getObjectById<StructureLink>(this.linkId);
        this.source = Game.getObjectById<Source>(this.sourceId);
    }

    protected onUpdate(creep: Creep): void {
        if (this.arrived && !this.repaired && this.container && this.container.hits >= this.container.hitsMax - 10)
            this.repaired = true;
        if (!this.arrived)
            if (creep.pos.getRangeTo(this.container) == 0)
                this.arrived = true;
    }

    protected onExecute(creep: Creep): void {        
        if (this.repaired) {
            this.harvest(creep);
        } else if (this.arrived) {
            this.repair(creep);
        } else {
            if (creep.pos.getRangeTo(this.container) > 0)
                this.moving(creep);   
        }
    }

    protected onCleanup(creep: Creep): void { }

    private repair(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.carry.energy >= 25) {
            if (creep.repair(this.container) == OK)
                colony.resourceManager.ledger.registerRepair(creep);
        } else {
            if (creep.harvest(this.source) == OK)
                colony.resourceManager.ledger.registerHarvest(creep);
        }
    }

    private moving(creep: Creep): void {        
        creep.moveTo(this.container);
    }
    
    private harvest(creep: Creep): void {
        let colony = global.empire.getColonyByCreep(creep);

        if (creep.harvest(this.source) == OK)
            colony.resourceManager.ledger.registerHarvest(creep);

        let harvestAmount = creep.getActiveBodyparts(WORK) * HARVEST_POWER;
        if (creep.carryCapacity - creep.carry.energy < harvestAmount) {
            if (this.link && this.link.energy < this.link.energyCapacity)
                creep.transfer(this.link, RESOURCE_ENERGY);
            else
                creep.transfer(this.container, RESOURCE_ENERGY);
        }            
    }

    protected onSave(): HarvesterControllerMemory {
        return {
            type: this.type,
            arrived: this.arrived,
            containerId: this.containerId,
            linkId: this.linkId,
            sourceId: this.sourceId,
            repaired: this.repaired
        };
    }
}

export interface HarvesterControllerMemory extends CreepControllerMemory {
    arrived: boolean;
    containerId: string;
    linkId: string;
    sourceId: string;
    repaired: boolean;
}
