import { Nest } from "./Nest";
import { Population } from "./Population";
import { ResourceManager } from "./ResourceManager";

import { Empire } from "../empire/Empire";
import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";
import { ColonyPlan } from "../colonyPlan/ColonyPlan";
import { ColonyPlanRepository } from "../colonyPlan/ColonyPlanRepository";
import { MapBlock } from "../map/base/MapBlock";

export class Colony  {
    public static fromMemory(memory: ColonyMemory): Colony {
        let colony = new this(
            Nest.fromMemory(memory.nest),
            memory.name,
            ColonyPlanRepository.load(memory.plan)
        );
        colony.resourceManager = ResourceManager.fromMemory(memory.resourceManager, colony);
        return colony;
    }

    constructor(nest: Nest, name: string, plan: ColonyPlan) {
        this.nest = nest;
        this.name = name;
        this.plan = plan;

        this.population = new Population(this);
        this.resourceManager = new ResourceManager(this);
    }
    
    public population: Population;
    public resourceManager: ResourceManager;
    public name: string;
    public nest: Nest;
    public plan: ColonyPlan;


    //## update loop

    public load(): void {
        this.nest.load();
        this.resourceManager.load();
        this.plan.load();
    }

    public update(): void {        
        this.nest.update();
        this.resourceManager.update();
        this.population.update();        
        this.plan.update(this);        
    }

    public execute(): void {
        this.nest.execute();
        this.resourceManager.execute();
        this.plan.execute(this);        
    }

    public cleanup(): void {
        this.nest.cleanup();
        this.resourceManager.cleanup();
        this.plan.cleanup(this);        
    }

    public save(): ColonyMemory {
        return {
            name: this.name,
            nest: this.nest.save(),
            plan: this.plan.save(),
            resourceManager: this.resourceManager.save()
        };
    }

    //## end update loop

    public creepBelongsToColony(creep: (Creep | string)): boolean {
        if (creep instanceof Creep)
            return this.creepBelongsToColony(creep.name);

        return this.population.creepFromThisColony(Memory.creeps[creep]);
    }

    public canSpawn(body: Body): boolean {
        return this.nest.canSpawn(body)
    }

    /** Returns the Spawner used if successful, otherwise null */
    public spawnCreep(body: Body): {name: string, spawner: Spawner} | null {
        var result = this.nest.spawnCreep(body);
        if (result)
            global.events.colony.creepSpawning(this.name, result.name, body.type);
        return result;
    }

    public getWithdrawTarget(creep: Creep): WithdrawTarget {
        return this.resourceManager.getWithdrawTarget(creep);
    }

    public getTransferTarget(creep: Creep): TransferTarget {
        return this.resourceManager.getTransferTarget(creep);
    }

    public getSpawnTransferTarget(creep: Creep): (StructureSpawn | StructureExtension) {
        return this.resourceManager.getSpawnExtensionTransferTargets(creep);
    }

    public getControllerEnergySource(): (StructureContainer | StructureLink) {
        let loc = this.nest.nestMap.controllerBlock.getContainerLocation();
        let source = this.nest.room.lookForAt(LOOK_STRUCTURES, loc.x, loc.y);
        if (source.length) {
            if (source[0].structureType == STRUCTURE_CONTAINER)
                return source[0] as StructureContainer;
            else if (source[0].structureType == STRUCTURE_LINK)
                return source[0] as StructureLink;
        }
            
        return null;
    }
}
