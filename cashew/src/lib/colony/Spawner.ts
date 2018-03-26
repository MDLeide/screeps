import { Body } from "../creep/Body";
import { CreepNamer } from "./CreepNamer";

export class Spawner {
    private _updated: boolean;
    private _cleanedup: boolean;
    private _startedThisTick: string;    

    constructor(spawnId: string) {        
        this.spawnId = spawnId;
        this.spawn = Game.getObjectById<StructureSpawn>(spawnId);
    }

    public spawnId: string;
    public spawn: StructureSpawn;
    public get startedThisTick(): string { return this._startedThisTick; }    

    public getCurrentlySpawning(): { name: string, remainingTime: number, needTime: number } {
        return this.spawn.spawning;
    }

    public canSpawn(body: Body): boolean {        
        return !this.spawn.spawning
            && !this.startedThisTick
            && this.spawn.room.energyAvailable >= body.minimumEnergy
            && (!body.waitForFullEnergy
                || this.spawn.room.energyAvailable == this.spawn.room.energyCapacityAvailable
                || this.spawn.room.energyAvailable >= body.maximumEnergy);
    }
    
    public spawnCreep(body: Body, fillOrder: (StructureExtension | StructureSpawn)[]): string | null {
        if (!this._updated || this._cleanedup)
            throw new Error("Only call spawner.spawnCreep() during the execute phase.");        
        
        if (!this.canSpawn(body))
            return null;        
        
        let finalBody = body.getBody(this.spawn.room.energyAvailable);        
        var name = CreepNamer.getCreepName(body, this);
        var result = this.spawn.spawnCreep(
            finalBody,
            name,
            {
                memory: {
                    homeSpawnId: this.spawn.id,
                    body: body.type,
                    operation: "",
                    birthTick: Game.time + 1,
                    deathTick: 0
                },
                energyStructures: fillOrder
            });

        if (result == OK) {
            this._startedThisTick = name;
            let colony = global.empire.getColonyBySpawn(this.spawn);
            colony.resourceManager.ledger.registerSpawn(Body.getBodyCost(finalBody));
            return name;
        } else if (result == ERR_NAME_EXISTS) {
            global.events.colony.spawnError(this.spawn.name, body.type, "Name already exists.");
        } else if (result == ERR_INVALID_ARGS) {
            global.events.colony.spawnError(this.spawn.name, body.type, "Bad body or no name.");
        }
        return null;
    }
    

    public load(): void {
        this.spawn = Game.getObjectById<StructureSpawn>(this.spawnId);
    }

    public update(): void {
        this._cleanedup = false;
        this._updated = true;        
        this._startedThisTick = null;
    }

    public execute(): void {

    }

    public cleanup(): void {
        this._updated = false;
        this._cleanedup = true;
    }
}
    

