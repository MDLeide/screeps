import { Colony } from "./Colony";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export class Nest {
    private spawners: Spawner[];

    public room: Room;

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return _.any(this.spawners, (p) => p.canSpawn(spawnDefinition));
    }

    /** Returns the Spawner used if successful, otherwise null */
    public spawnCreep(spawnDefinition: SpawnDefinition): Spawner | null {
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].canSpawn(spawnDefinition)) {
                if (this.spawners[i].spawnCreep(spawnDefinition))
                    return this.spawners[i];
            }
        }
        return null;
    }

    public update(colony: Colony): void {
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].update();
        }
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].execute();
        }
    }

    public cleanup(colony: Colony): void {
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].cleanup();
        }
    }
}
