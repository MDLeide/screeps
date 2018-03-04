import { CreepController } from "../../lib/creep/CreepController";

export class HarvestInfrastructureBuilderController extends CreepController {
    public static fromMemory(memory: HarvestInfrastructureBuilderControllerMemory ): CreepController {
        let cont = new this(memory.sourceId, memory.siteId);
        cont.harvest = memory.harvest;
        return CreepController.fromMemory(memory, cont);
    }

    constructor(sourceId: string, siteId: string) {
        super(CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER);
        this.sourceId = sourceId;
        this.siteId = siteId;
    }
        
    public sourceId: string;
    public siteId: string;
    public harvest: boolean;

    protected onLoad(): void {
    }

    protected onUpdate(creep: Creep): void {
        if (this.harvest) {
            if (creep.carry.energy == creep.carryCapacity)
                this.harvest = false;            
        } else {
            if (creep.carry.energy == 0)
                this.harvest = true;
        }
    }

    protected onExecute(creep: Creep): void {
        var source = Game.getObjectById<Source>(this.sourceId);
        let colony = global.empire.getColonyByCreep(creep);

        if (this.harvest) {            
            let response = creep.harvest(source);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(source);
            else if (response == OK)
                colony.resourceManager.ledger.registerHarvest(
                    creep.getActiveBodyparts(WORK) * HARVEST_POWER);
        } else {
            var spawn = source.room.find<StructureSpawn>(FIND_MY_STRUCTURES, {
                filter: (spawn) => { return spawn.structureType == STRUCTURE_SPAWN }
            })[0];

            if (spawn.energy < spawn.energyCapacity) {
                let response = creep.transfer(spawn, RESOURCE_ENERGY);
                if (response == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn);
            } else {
                let site = Game.getObjectById<ConstructionSite>(this.siteId);
                let response = creep.build(site);
                if (response == ERR_NOT_IN_RANGE)
                    creep.moveTo(site);
                else if (response == OK)
                    colony.resourceManager.ledger.registerBuild(
                        Math.min(creep.carry.energy, creep.getActiveBodyparts(WORK) * BUILD_POWER));
            }
        }
    }

    protected onCleanup(creep: Creep): void { }
    
    protected onSave(): HarvestInfrastructureBuilderControllerMemory {
        return {
            type: this.type,
            sourceId: this.sourceId,
            siteId: this.siteId,
            harvest: this.harvest
        };
    }
}

export interface HarvestInfrastructureBuilderControllerMemory extends CreepControllerMemory {
    sourceId: string;
    siteId: string;
    harvest: boolean;
}
