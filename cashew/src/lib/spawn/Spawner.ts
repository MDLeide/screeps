import { SpawnDefinition } from "./SpawnDefinition";
import { Body } from "../creep/body/Body";

export class Spawner {
    private _updated: boolean;
    private _cleanedup: boolean;
    private _startedThisTick: string;    

    constructor(spawnId: string) {        
        this.spawnId = spawnId;
    }

    public spawnId: string;
    public spawn: StructureSpawn;
    public get startedThisTick(): string { return this._startedThisTick; }
    

    public getCurrentlySpawning(): { name: string, remainingTime: number, needTime: number } {
        return this.spawn.spawning;
    }

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {        
        return (!this.spawn.spawning && !this.startedThisTick && this.spawn.energy >= spawnDefinition.minimumEnergy);
    }

    public spawnCreep(spawnDefinition: SpawnDefinition): string | null {
        if (!this._updated || this._cleanedup) {
            throw new Error("Only call spawner.spawnCreep() during the execute phase.");
        }

        if (!this.canSpawn(spawnDefinition)) {
            return null;
        }

        console.log(
            "<span style='color:lightblue'>" +
            this.spawn.name +
            "</span>" +
            " making " +
            "<span style='color:yellow'>" +
            spawnDefinition.roleId +
            "</span>");

        var name = spawnDefinition.getName(this);
        var result = this.spawn.spawnCreep(
            spawnDefinition.getBody(this.spawn.energy).parts,
            name,
            {
                memory: {
                    homeSpawnId: this.spawn.id,
                    spawnDefId: spawnDefinition.id,
                    roleId: spawnDefinition.roleId,
                    role: null,
                    birthTick: Game.time + 1,
                    deathTick: 0
                }
            });

        if (result != OK) {
            console.log(
                "<span style='color:lightblue'>" +
                this.spawn.name +
                "</span><span style='color:red'>" +
                " failed to spawn creep: " +
                result.toString() +
                "</span>");
            return null;
        } else {
            this._startedThisTick = name;
            return name;
        }
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
    

