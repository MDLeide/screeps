import { Colony } from "./Colony";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export class Nest {
    private spawner: Spawner;

    public room: Room;

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return this.spawner.canSpawn(spawnDefinition)
    }

    public spawnCreep(spawnDefinition: SpawnDefinition): boolean {
        return this.spawner.spawnCreep(spawnDefinition);
    }

    public update(colony: Colony): void {
        this.spawner.update();
    }

    public execute(colony: Colony): void {
        this.spawner.execute();
    }

    public cleanup(colony: Colony): void {
        this.spawner.cleanup();
    }
}
