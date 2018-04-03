import { Empire } from "../empire/Empire";
import { Colony } from "./Colony";
import { NestMap } from "../map/NestMap";
import { Spawner } from "./Spawner";
import { Body } from "../creep/Body";
import { SpawnRequest } from "./SpawnRequest";
import { CreepNamer } from "./CreepNamer";
import { SpawnStatTracker } from "./SpawnStats";


export class Nest {
    public static fromMemory(memory: NestMemory): Nest {
        let nest = new this(memory.roomName, NestMap.fromMemory(memory.map));
        nest.spawnEnergyStructureOrderIds = memory.spawnEnergyStructureOrderIds;        
        nest.spawnQueue = [];
        if (memory.spawnQueue)
            for (var i = 0; i < memory.spawnQueue.length; i++)
                nest.spawnQueue.push(SpawnRequest.fromMemory(memory.spawnQueue[i]));
        nest.spawnStats = SpawnStatTracker.fromMemory(memory.spawnStats);
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
        for (var i = 0; i < spawns.length; i++)
            this.spawners.push(new Spawner(spawns[i].id));
        this.spawnStats = new SpawnStatTracker();
    }

    public spawners: Spawner[];
    public spawnEnergyStructureOrderIds: string[] = [];
    public spawnEnergyStructureOrder: (StructureExtension | StructureSpawn)[] = [];
    public nestMap: NestMap;
    public roomName: string;    
    public room: Room;
    public spawnQueue: SpawnRequest[] = [];
    public spawnStats: SpawnStatTracker;


    public canSpawn(body: Body): boolean {
        return this.spawners.length > 0 && this.room.energyCapacityAvailable >= body.minimumEnergy;
    }

    /** Returns true if the Nest can support the spawn request from another Colony. */
    public canSpawnSupport(body: Body): boolean {
        if (!this.canSpawn(body))
            return false;
        return this.spawnStats.getAverageSaturation() < .8;            
    }

    /** Returns the name used if successful, otherwise null, not guaranteed to start spawning immediately */
    public spawnCreep(body: Body, requestingColonyName: string, spawningColonyName: string, priority?: number): string | null {
        if (!this.canSpawn(body))
            return null;
        
        let name = CreepNamer.getCreepName(body, this) + "-" + this.spawnQueue.length;
        let request = new SpawnRequest(name, body, priority);
        let index = _.sortedIndex(this.spawnQueue, request, (p) => p.priority * -10000 - p.age);
        this.spawnQueue.splice(index, 0, request);
        Memory.creeps[name] = {
            birthTick: undefined,
            body: body.type,
            deathTick: 0,
            colony: requestingColonyName,
            spawningColony: spawningColonyName,
            operation: undefined
        };
        global.events.colony.creepScheduled(spawningColonyName, name, body.type, requestingColonyName);
        return name;
    }
    
    public cancelSpawn(name: string): void {
        for (var i = 0; i < this.spawnQueue.length; i++) {
            let req = this.spawnQueue[i];
            if (req.name == name) {
                Memory.creeps[req.name] = undefined;
                this.spawnQueue.splice(i--, 1);
                return;
            }
        }
    }

    public clearSpawnQueue(): void {
        for (var i = 0; i < this.spawnQueue.length; i++) {
            Memory.creeps[this.spawnQueue[i].name] = undefined;
            this.spawnQueue.splice(i--, 1);
        }
    }

    public creepIsScheduled(creep: Creep | string): boolean {
        if (creep instanceof Creep)
            return this.creepIsScheduled(creep.name);
        for (var i = 0; i < this.spawners.length; i++) {
            if (this.spawners[i].startedThisTick == creep)
                return true;
            let current = this.spawners[i].getCurrentlySpawning();
            if (current && current.name == creep)
                return true;
        }

        for (var i = 0; i < this.spawnQueue.length; i++)
            if (this.spawnQueue[i].name == creep)
                return true;
        return false;
    }

    public load(): void {        
        this.room = Game.rooms[this.roomName];
        for (var i = 0; i < this.spawners.length; i++)
            this.spawners[i].load();
        
        this.spawnEnergyStructureOrder = [];
        for (var i = 0; i < this.spawnEnergyStructureOrderIds.length; i++)
            this.spawnEnergyStructureOrder.push(Game.getObjectById<(StructureExtension | StructureSpawn)>(this.spawnEnergyStructureOrderIds[i]));        
    }

    public update(colony: Colony): void {
        this.checkEnergyStructureOrder();
        for (var i = 0; i < this.spawners.length; i++)
            this.spawners[i].update();        
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.spawners.length; i++)
            this.spawners[i].execute();        
    }

    public cleanup(colony: Colony): void {
        for (var i = 0; i < this.spawners.length; i++) {            
            // we'll do the spawning in cleanup, so we can be fairly certain everything has had a chance to request
            if (this.spawnQueue.length) {
                if (this.spawners[i].canSpawn(this.spawnQueue[0].body)) {
                    let result = this.spawners[i].spawnCreep(this.spawnQueue[0].body, this.spawnEnergyStructureOrder, this.spawnQueue[0].name);
                    global.events.colony.creepSpawning(colony.name, this.spawnQueue[0].name, this.spawnQueue[0].body.type);
                    this.spawnQueue.splice(0, 1);
                }
            }
            this.spawners[i].cleanup();
        }
        this.spawnStats.update(this);
    }

    public checkEnergyStructureOrder(): void {
        if (!this.spawnEnergyStructureOrder || (this.spawnEnergyStructureOrder && this.spawnEnergyStructureOrder.length == 0) || Game.time % 100 == 0) {
            let spawns = this.room.find<StructureSpawn>(
                FIND_MY_STRUCTURES,
                { filter: (s) => s.structureType == STRUCTURE_SPAWN });
            let extensions = this.room.find<StructureExtension>(
                FIND_MY_STRUCTURES,
                { filter: (e) => e.structureType == STRUCTURE_EXTENSION });
            if (extensions.length + spawns.length > this.spawnEnergyStructureOrderIds.length) {
                this.updateEnergyStructureOrder();
            }
        }
    }
    
    private updateEnergyStructureOrder(): void {
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
        let spawns = this.room.find<StructureSpawn>(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });

        for (var i = 0; i < spawns.length; i++)
            order.push(spawns[i].id);

        this.spawnEnergyStructureOrderIds = order;
    }

    public save(): NestMemory {
        return {
            roomName: this.roomName,
            map: this.nestMap.save(),
            spawnEnergyStructureOrderIds: this.spawnEnergyStructureOrderIds,
            spawnQueue: this.spawnQueue.map(p => p.save()),
            spawnStats: this.spawnStats.save()
        };
    }
}
