import { SpawnDefinition } from "./SpawnDefinition";
import { Body } from "../creep/body/Body";

export class Spawner {
    private _updated: boolean;
    private _cleanedup: boolean;

    private _spawn: StructureSpawn;
    private _currentlySpawning: Creep;
    private _currentSpawnTotalGestation: number;
    private _startedThisTick: string;    

    constructor(spawn: StructureSpawn) {
        this._spawn = spawn;
    }

    public get spawn(): StructureSpawn { return this._spawn; }
    public get currentlySpawning(): Creep { return this._currentlySpawning; }
    /** If a creep started spawning this tick, this property will contain its name. */
    public get startedThisTick(): string { return this._startedThisTick; }

    public canSpawn(spawnDefinition: SpawnDefinition): boolean {
        return (!this.spawn.spawning && !this.startedThisTick && this.spawn.energy >= spawnDefinition.minimumEnergy);
    }

    public spawnCreep(spawnDefinition: SpawnDefinition): boolean {
        if (!this._updated || this._cleanedup) {
            throw new Error("Only call spawner.spawnCreep() during the execute phase.");
        }

        if (!this.canSpawn(spawnDefinition)) {
            return false;
        }

        console.log(
            "<span style='color:lightblue'>" +
            this.spawn.name +
            "</span>" +
            " making " +
            "<span style='color:yellow'>" +
            spawnDefinition.roleId +
            "</span>");

        var result = this.spawn.spawnCreep(spawnDefinition.getBody(this.spawn.energy).parts, name,
            {
                memory: {
                    homeSpawnId: this.spawn.id,
                    roleId: spawnDefinition.roleId,
                    role: null
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
            return false;
        } else {
            return true;
        }
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
    

