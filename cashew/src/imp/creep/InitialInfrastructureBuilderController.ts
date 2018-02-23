import { CreepController } from "../../lib/creep/CreepController";

export class InitialInfrastructureBuilderController extends CreepController {
    public static readonly myName: string = "InitialInfrastructureBuilderController";

    public static fromMemory(memory: InitialInfrastructureBuilderControllerMemory ): InitialInfrastructureBuilderController {
        let cont = new this(memory.sourceId, memory.siteId);
        cont.harvest = memory.harvest;
        return cont;
    }

    constructor(sourceId: string, siteId: string) {
        super(InitialInfrastructureBuilderController.myName);
        this.sourceId = sourceId;
        this.siteId = siteId;
    }
        
    public sourceId: string;
    public siteId: string;
    public harvest: boolean;

    protected onLoad(creep: Creep): void {
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
        if (this.harvest) {            
            let response = creep.harvest(source);
            if (response == ERR_NOT_IN_RANGE)
                creep.moveTo(source);
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
            }
        }
    }

    protected onCleanup(creep: Creep): void { }
    
    protected onSave(): InitialInfrastructureBuilderControllerMemory {
        return {
            name: this.name,
            sourceId: this.sourceId,
            siteId: this.siteId,
            harvest: this.harvest
        };
    }
}

export interface InitialInfrastructureBuilderControllerMemory extends CreepControllerMemory {
    sourceId: string;
    siteId: string;
    harvest: boolean;
}
