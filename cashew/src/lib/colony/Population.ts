import { Colony } from "./Colony";

export class Population {
    private lastTick: number = -1;

    private _alive: string[];
    private _spawning: string[];
    private _bornThisTick: string[];
    private _diedLastTick: string[]
    private _diedRecently: string[];
    private _roleCallAlive: { [roleId: string]: string[] };
    private _roleCallSpawning: { [roleId: string]: string[] };
    private _deathLength: number = 50; // number of ticks to keep dead creeps

    constructor(colony: Colony) {
        this.colony = colony;
    }

    public colony: Colony;

    public update(): void {
        if (this.shouldFill())
            this.fill();
    }

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
        return this._diedRecently;
    }
    public get diedLastTick(): string[] {
        if (this.shouldFill())
            this.fill();
        return this._diedLastTick;
    }
    public get roleCallAlive(): { [roleId: string]: string[] } {
        if (this.shouldFill())
            this.fill();
        return this._roleCallAlive;
    }
    public get roleCallSpawning(): { [roleId: string]: string[] } {
        if (this.shouldFill())
            this.fill();
        return this._roleCallSpawning;
    }


    public isAlive(creep: string): boolean
    public isAlive(creep: Creep): boolean
    public isAlive(creep: any): boolean {
        return this.listContainsCreep(creep, this.alive);
    }
    
    public isSpawning(creep: string): boolean
    public isSpawning(creep: Creep): boolean
    public isSpawning(creep: any): boolean {
        return this.listContainsCreep(creep, this.spawning);
    }

    public isAliveOrSpawning(creep: string): boolean
    public isAliveOrSpawning(creep: Creep): boolean
    public isAliveOrSpawning(creep: any): boolean {
        if (this.listContainsCreep(creep, this.spawning))
            return true;
        return this.listContainsCreep(creep, this.alive);
    }

    public wasBornThisTick(creep: string): boolean
    public wasBornThisTick(creep: Creep): boolean
    public wasBornThisTick(creep: any): boolean {
        return this.listContainsCreep(creep, this.bornThisTick);
    }

    public didDieRecently(creep: string): boolean
    public didDieRecently(creep: Creep): boolean
    public didDieRecently(creep: any): boolean {
        return this.listContainsCreep(creep, this.diedRecently);
    }

    public didDieLastTick(creep: string): boolean
    public didDieLastTick(creep: Creep): boolean
    public didDieLastTick(creep: any): boolean {
        return this.listContainsCreep(creep, this.diedLastTick);
    }

    public roleCount(roleId: string, includeSpawning: boolean = false) : number {
        var count = 0;
        if (this.roleCallAlive[roleId])
            count += this.roleCallAlive[roleId].length;
        if (includeSpawning && this.roleCallSpawning[roleId])
            count += this.roleCallSpawning[roleId].length;
        return count;
    }


    private listContainsCreep(creep: any, list: string[]) {
        var name = "";
        if (typeof creep == "string") {
            name = creep;
        } else {
            name = creep.name;
        }

        for (var i = 0; i < list.length; i++) {
            if (list[i] == name) {
                return true;
            }
        }
        return false;
    }

    private fill(): void {
        this.lastTick = Game.time;

        this._alive = [];
        this._spawning = [];
        this._bornThisTick = [];
        this._diedLastTick = [];
        this._diedRecently = [];
        this._roleCallAlive = {};
        this._roleCallSpawning = {};

        var toDelete: string[] = [];

        for (var key in Memory.creeps) {
            if (!this.thisColony(Memory.creeps[key]))
                continue;
            
            var creep = Game.creeps[key];
            if (!creep) { // creep is dead
                if (Memory.creeps[key].deathTick <= 0) {
                    Memory.creeps[key].deathTick = Game.time;
                    this._diedLastTick.push(key);
                }

                if (Game.time - Memory.creeps[key].deathTick >= this._deathLength) {
                    toDelete.push(key);
                } else {
                    this._diedRecently.push(key)
                }
            } else if (creep.spawning) {
                if (!this._roleCallSpawning[Memory.creeps[key].roleId])
                    this._roleCallSpawning[Memory.creeps[key].roleId] = []
                this._roleCallSpawning[Memory.creeps[key].roleId].push(key);
                this._spawning.push(key);
            } else {
                if (!this._roleCallAlive[Memory.creeps[key].roleId])
                    this._roleCallAlive[Memory.creeps[key].roleId] = []
                this._roleCallAlive[Memory.creeps[key].roleId].push(key);
                this._alive.push(key);
            }
        }

        for (var i = 0; i < toDelete.length; i++) {
            delete Memory.creeps[toDelete[i]];
        }
    }

    private thisColony(creep: CreepMemory) {
        for (var i = 0; i < this.colony.nest.spawners.length; i++) {
            if (creep.homeSpawnId == this.colony.nest.spawners[i].spawn.id) {
                return true;
            }
        }
        return false;
    }


    private shouldFill(): boolean {
        return Game.time != this.lastTick;
    }
}
