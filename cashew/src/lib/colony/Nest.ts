import { Empire } from "../empire/Empire";
import { Colony } from "./Colony";
import { NestMap } from "../map/NestMap";

import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export class Nest {
    public static fromMemory(memory: NestMemory): Nest {        
        return new this(memory.roomName, NestMap.fromMemory(memory.map));
    }

    constructor(roomName: string, nestMap: NestMap) {
        this.roomName = roomName;
                        
        this.spawners = [];
        var spawns = this.room.nut.seed.findMySpawns();
        for (var i = 0; i < spawns.length; i++) {
            this.spawners.push(new Spawner(spawns[i].id));
        }
    }

    public spawners: Spawner[];    
    public nestMap: NestMap;
    public roomName: string;    
    public room: Room;
    

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
    

    public load(): void {
        this.room = Game.getObjectById<Room>(this.roomName);
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].load();
        }
    }

    public update(): void {        
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].update();
        }
    }

    public execute(): void {
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].execute();
        }
    }

    public cleanup(): void {
        for (var i = 0; i < this.spawners.length; i++) {
            this.spawners[i].cleanup();
        }
    }

    public save(): NestMemory {
        return {
            roomName: this.roomName,
            map: this.nestMap.save()
        };
    }
}
