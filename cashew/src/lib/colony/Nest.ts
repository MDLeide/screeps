import { Colony } from "./Colony";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export class Nest {    
    private _room: Room;


    constructor(room: Room) {
        this.state.id = room.name;
    }

    

    public state: NestMemory;

    public spawners: Spawner[];    
    public get id(): string { return this.room.name; }    
    public get room(): Room {
        if (!this._room) {
            this._room = Game.getObjectById<Room>(this.state.id);
        }
        return this._room;
    }

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
