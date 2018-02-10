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
    private _nestRepository: NestRepository = new NestRepository();
    private _planRepository: ColonyPlanRepository = new ColonyPlanRepository();
    private _harvestBlocks: IdArray<MapBlock>;
    private _mapBlockRepo: MapBlockRepo = new MapBlockRepo();

    private _nest: Nest;
    private _plan: ColonyPlan;
    private _population: Population;

    constructor(nest: Nest, name: string) {
        this._nest = nest;
        this.state.nestId = nest.id;

        this.state.id = nest.id;
        this.state.name = name;
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
    public get harvestBlocks(): IdArray<MapBlock> {
        if (!this._harvestBlocks) {
            var blocks = []
            for (var i = 0; i < this.state.harvestBlockIds.length; i++) {
                blocks.push(this._mapBlockRepo.get(this.state.harvestBlockIds[i]));
            }
            this._harvestBlocks = new IdArray<MapBlock>(this.state.harvestBlockIds, blocks);
        }
        return this._harvestBlocks;
    }



    //## update loop

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

    //## end update loop

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return this.nest.canSpawn(spawnDefinition)
    }

    /** Returns the Spawner used if successful, otherwise null */
    public spawnCreep(spawnDefinition: SpawnDefinition): {name: string, spawner: Spawner} | null {
        return this.nest.spawnCreep(spawnDefinition);
    }
}
