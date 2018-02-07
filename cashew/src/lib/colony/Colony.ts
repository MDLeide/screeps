import { Nest } from "./Nest";
import { ColonyPlan } from "./ColonyPlan";

import { NestRepository } from "./repo/NestRepository";
import { ColonyPlanRepository } from "./repo/ColonyPlanRepository";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";
import { Empire } from "../empire/Empire";

import { Guid } from "../../util/GUID";

export class Colony  {
    private _nestRepository: NestRepository = new NestRepository();
    private _planRepository: ColonyPlanRepository = new ColonyPlanRepository();

    private _nest: Nest;
    private _plan: ColonyPlan;

    constructor(nest: Nest, name: string) {
        this._nest = nest;
        this.state.nestId = nest.id;

        this.state.id = Guid.newGuid();
        this.state.name = name;
    }

    public get id(): string { return this.state.id; }
    public get name(): string { return this.state.name; };
    public get nest(): Nest {
        if (!this._nest) {
            this._nest = this._nestRepository.get(this.state.nestId);
        }
        return this._nest;
    }
    public get plan(): ColonyPlan {
        if (!this._plan) {
            this._plan = this._planRepository.get(this.state.planId);
        }
        return this._plan;
    }

    public state: ColonyMemory;

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return this.nest.canSpawn(spawnDefinition)
    }

    /** Returns the Spawner used if successful, otherwise null */
    public spawnCreep(spawnDefinition: SpawnDefinition): Spawner | null {
        return this.nest.spawnCreep(spawnDefinition);
    }

    public update(empire: Empire): void {
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
}
