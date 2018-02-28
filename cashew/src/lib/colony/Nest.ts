import { Empire } from "../empire/Empire";
import { Colony } from "./Colony";
import { NestMap } from "../map/NestMap";
import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";


export class Nest {
    public static fromMemory(memory: NestMemory): Nest {        
        return new this(memory.roomName, NestMap.fromMemory(memory.map));
    }

    constructor(roomName: string, nestMap: NestMap) {
        this.roomName = roomName;
        this.room = Game.rooms[roomName];
        this.nestMap = nestMap;

        this.spawners = [];
        let spawns = this.room.find(FIND_MY_STRUCTURES, {
            filter: (struct) => struct.structureType == STRUCTURE_SPAWN
        });
        for (var i = 0; i < spawns.length; i++) {
            this.spawners.push(new Spawner(spawns[i].id));
        }
    }


    public spawners: Spawner[];
    public nestMap: NestMap;
    public roomName: string;    
    public room: Room;
    

    public canSpawn(body: Body): boolean {
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].canSpawn(body))
                return true;
        }
        return false;
    }

    /** Returns the name and spawner used if successful, otherwise null */
    public spawnCreep(body: Body): { name: string, spawner: Spawner }  | null {
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].canSpawn(body)) {
                var name = this.spawners[i].spawnCreep(body); 
                if (name) 
                    return { name: name, spawner: this.spawners[i] };
            }
        }
        return null;
    }
    

    public load(): void {        
        this.room = Game.rooms[this.roomName];
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
