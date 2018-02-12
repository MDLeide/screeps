import { Nest } from "./Nest";
import { ColonyPlan } from "./ColonyPlan";
import { Population } from "./Population";

import { NestRepository } from "./repo/NestRepository";
import { ColonyPlanRepository } from "./repo/ColonyPlanRepository";

import { MapBlock } from "../map/MapBlock";
import { MapBlockRepo } from "../map/repo/MapBlockRepo";
import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";
import { Empire } from "../empire/Empire";

import { Guid } from "../../util/GUID";
import { IdArray } from "../../util/IdArray";

export class Colony  {
    private _nestRepository: NestRepository;
    private get nestRepository(): NestRepository {
        if (!this._nestRepository)
            this._nestRepository = new NestRepository();
        return this._nestRepository;
    }

    private _planRepository: ColonyPlanRepository;
    private get planRepository(): ColonyPlanRepository {
        if (!this._planRepository)
            this._planRepository = new ColonyPlanRepository();
        return this._planRepository;
    }
    
    private _nest: Nest;
    private _plan: ColonyPlan;
    private _population: Population;
    
    constructor(nest: Nest, name: string, plan: ColonyPlan) {
        this._nest = nest;

        this.state = {
            id: nest.id,
            name: name,
            nestId: nest.id,
            planId: plan.id,
            harvestBlockIds: []
        }
    }


    public state: ColonyMemory;

    public get population(): Population {
        if (!this._population)
            this._population = new Population(this);
        return this._population;
    }
    public get id(): string { return this.nest.id; }
    public get name(): string { return this.state.name; };
    public get nest(): Nest {
        if (!this._nest) {
            this._nest = this.nestRepository.find(this.state.nestId);
        }
        return this._nest;
    }
    public get plan(): ColonyPlan {
        if (!this._plan) {
            this._plan = this.planRepository.find(this.state.planId);
        }
        return this._plan;
    }
    


    //## update loop

    public update(empire: Empire): void {
        this.population.update();
        this.plan.update(this);
        this.nest.update(this);
    }

    public execute(empire: Empire): void {
        this.plan.execute(this);
        this.nest.execute(this);
    }

    public cleanup(empire: Empire): void {
        this.plan.cleanup(this);
        this.nest.cleanup(this);
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
