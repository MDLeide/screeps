import { ColonyPlan } from "./ColonyPlan";
import { ColonyPlanRepository } from "./ColonyPlanRepository";
import { Nest } from "./Nest";
import { Population } from "./Population";

import { MapBlock } from "../map/base/MapBlock";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

import { Empire } from "../empire/Empire";


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
    }
    
    public population: Population;    
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

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return this.nest.canSpawn(spawnDefinition)
    }

    /** Returns the Spawner used if successful, otherwise null */
    public spawnCreep(spawnDefinition: SpawnDefinition): {name: string, spawner: Spawner} | null {
        return this.nest.spawnCreep(spawnDefinition);
    }
}
