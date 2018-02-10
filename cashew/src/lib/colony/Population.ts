import { Colony } from "./Colony";

export class Population {
    private lastTick: number = -1;

    private _alive: string[];
    private _spawning: string[];
    private _bornThisTick: string[];
    private _deathLength: number = 50; // number of ticks to keep dead creeps

    constructor(colony: Colony, state: PopulationMemory) {
        
    }

    public colony: Colony;
    public state: PopulationMemory;
    
    public get alive(): string[] {
        if (this.shouldFill())
            this.fill();
        return this._alive;
    }
    public get spawning(): string[] {
        if (this.shouldFill())
            this.fill();
        return this._spawning;
    }
    public get bornThisTick(): string[] {
        if (this.shouldFill())
            this.fill();
        return this._bornThisTick;
    }
    public get diedRecently(): string[] {
        if (this.shouldFill())
            this.fill();
        return this.state.diedRecently;
    }

    private shouldFill(): boolean {
        return Game.time != this.lastTick;
    }

    private fill(): void {
        this.lastTick = Game.time;

        this._alive = [];
        this._spawning = [];
        this._bornThisTick = [];        

        var toDelete: string[] = [];

        for (var key in Memory.creeps) {
            var found = false;
            for (var i = 0; i < this.colony.nest.spawns.length; i++) {
                if (Memory.creeps[key].homeSpawnId == this.colony.nest.spawns[i].id) {
                    found = true;
                    break;
                }
            }

            if (!found)
                continue;

            var creep = Game.creeps[key];
            if (!creep) { // creep is dead
                if (!Memory.creeps[key].deathTick) {
                    Memory.creeps[key].deathTick = Game.time;
                    this.state.diedRecently.push(key);
                }
                else if (Game.time - Memory.creeps[key].deathTick >= this._deathLength) {
                    toDelete.push(key);
                }
            } else if (creep.spawning) {
                this._spawning.push(key);
            } else {
                this._alive.push(key);
            }
        }

        for (var i = 0; i < toDelete.length; i++) {
            delete Memory.creeps[toDelete[i]];
        }
    }

    private thisColony(creep: CreepMemory) {

    }
}
