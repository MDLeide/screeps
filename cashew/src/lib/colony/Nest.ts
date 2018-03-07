import { Empire } from "../empire/Empire";
import { Colony } from "./Colony";
import { NestMap } from "../map/NestMap";
import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";


export class Nest {
    public static fromMemory(memory: NestMemory): Nest {
        let nest = new this(memory.roomName, NestMap.fromMemory(memory.map));
        nest.fillOrderIds = memory.fillOrderIds;
        return nest;
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
    public fillOrderIds: string[] = [];
    public fillOrder: StructureExtension[] = [];
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
    public spawnCreep(body: Body): { name: string, spawner: Spawner } | null {        
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].canSpawn(body)) {
                var name = this.spawners[i].spawnCreep(body, this.fillOrder); 
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
        this.fillOrder = [];
        for (var i = 0; i < this.fillOrderIds.length; i++)
            this.fillOrder.push(Game.getObjectById<StructureExtension>(this.fillOrderIds[i]));        
    }

    public update(): void {
        this.checkFillOrder();
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

    private checkFillOrder(): void {
        if (!this.fillOrder || (this.fillOrder && this.fillOrder.length == 0) || Game.time % 100 == 0) {
            let extensions = this.room.find<StructureExtension>(
                FIND_MY_STRUCTURES,
                { filter: (e) => e.structureType == STRUCTURE_EXTENSION });
            if (extensions.length > this.fillOrderIds.length) {
                this.updateFillOrder();
            }
        }
    }
    
    private updateFillOrder(): void {
        let locations = this.nestMap.extensionBlock.getFillOrder();
        let order: string[] = [];
        for (var i = 0; i < locations.length; i++) {
            let look = this.room.lookForAt(LOOK_STRUCTURES, locations[i].x, locations[i].y);
            for (var j = 0; j < look.length; j++) {
                if (look[j].structureType == STRUCTURE_EXTENSION) {
                    order.push(look[j].id);
                    break;
                }
            }
        }
        this.fillOrderIds = order;
    }

    public save(): NestMemory {
        return {
            roomName: this.roomName,
            map: this.nestMap.save(),
            fillOrderIds: this.fillOrderIds
        };
    }
}
