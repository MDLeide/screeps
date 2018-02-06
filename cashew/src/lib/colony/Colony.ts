import { Nest } from "./Nest";
import { ColonyPlan } from "./ColonyPlan";

import { SpawnDefinition } from "../spawn/SpawnDefinition";
import { Empire } from "../empire/Empire";

import { Guid } from "../../util/GUID";

export class Colony  {
    constructor(nest: Nest, name: string) {
        this.nest = nest;
        this.id = Guid.newGuid();
    }

    public id: string;
    public name: string;
    public nest: Nest;
    public plan: ColonyPlan;

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return this.nest.canSpawn(spawnDefinition)
    }

    public spawnCreep(spawnDefinition: SpawnDefinition): boolean {
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
