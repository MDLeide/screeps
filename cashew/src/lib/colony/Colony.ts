import { Nest } from "./Nest";
import { ColonyPlan } from "./ColonyPlan";

import { IColonyState } from "./state/IColonyState";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";
import { Empire } from "../empire/Empire";

import { Guid } from "../../util/GUID";

export class Colony  {

    constructor(nest: Nest, name: string) {
        this.nest = nest;
        this.state.id = Guid.newGuid();
        this.state.name = name;
    }

    public get id(): string { return this.state.id; }
    public get name(): string { return this.state.name; };
    public nest: Nest;
    public plan: ColonyPlan;

    public state: IColonyState;

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
