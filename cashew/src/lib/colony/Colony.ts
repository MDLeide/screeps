import { Nest } from "./Nest";
import { Population } from "./Population";
import { ResourceManager } from "./ResourceManager";

import { Empire } from "../empire/Empire";
import { Spawner } from "../spawn/Spawner";
import { Body } from "../spawn/Body";
import { ColonyPlan } from "../colonyPlan/ColonyPlan";
import { ColonyPlanRepository } from "../colonyPlan/ColonyPlanRepository";
import { MapBlock } from "../map/base/MapBlock";

export class Colony  {
    public static fromMemory(memory: ColonyMemory): Colony {
        return new this(
            Nest.fromMemory(memory.nest),
            memory.name,
            ColonyPlanRepository.load(memory.plan)
        );
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
    }

    public update(): void {        
        this.population.update();        
        this.plan.update(this);        
        this.nest.update();
    }

    public execute(): void {
        this.plan.execute(this);
        this.nest.execute();
    }

    public cleanup(): void {
        this.plan.cleanup(this);
        this.nest.cleanup();
    }

    public save(): ColonyMemory {
        return {
            name: this.name,
            nest: this.nest.save(),
            plan: this.plan.save()
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
            global.events.colony.creepSpawning(this.name, result.name, body.name);
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
}
