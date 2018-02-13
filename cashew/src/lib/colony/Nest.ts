import { Empire } from "../empire/Empire";
import { Colony } from "./Colony";
import { NestMap } from "../map/NestMap";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export class Nest {
    private _spawners: Spawner[];
    private _nestMap: NestMap;

    constructor(roomName: string) {
        this.state = {
            id: roomName
        }
    }


    public state: NestMemory;


    public get spawners(): Spawner[] {
        if (!this._spawners) {
            this._spawners = [];
            var spawns = this.room.nut.seed.findMySpawns();
            for (var i = 0; i < spawns.length; i++) {
                this._spawners.push(new Spawner(spawns[i]));
            }
        }
        return this._spawners;
    }
    public get id(): string { return this.room.name; }    
    public get room(): Room {        
        return Game.rooms[this.state.id];
    }
    public get nestMap(): NestMap {
        if (!this._nestMap)
            this._nestMap = Empire.getEmpireInstance().nestMapBuilder.getMap(this.room);
        return this._nestMap;
    }

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].canSpawn(spawnDefinition))
                return true;
        }
        return false;
    }

    /** Returns the name and spawner used if successful, otherwise null */
    public spawnCreep(spawnDefinition: SpawnDefinition): { name: string, spawner: Spawner }  | null {
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].canSpawn(spawnDefinition)) {
                var name = this.spawners[i].spawnCreep(spawnDefinition); 
                if (name) 
                    return { name: name, spawner: this.spawners[i] };
            }
        }
        return null;
    }

    public update(colony: Colony): void {
        this._spawners = null;
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
