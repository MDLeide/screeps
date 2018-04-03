import { Colony } from "./Colony";

export class Population {    
    private keepDeadCreepsFor: number = 50; // number of ticks to keep dead creeps

    constructor(colony: Colony) {
        this.colony = colony;
    }

    public colony: Colony;

    public update(): void {        
        this.updatePopulation();
    }

    public alive: string[];
    public spawning: string[];
    public bornThisTick: string[];
    public diedRecently: string[];
    public diedLastTick: string[];

    public notAssignedToOperation(): string[] {
        var unassigned: string[] = [];
        for (var i = 0; i < this.alive.length; i++)
            if (!Memory.creeps[this.alive[i]].operation || Memory.creeps[this.alive[i]].operation == "")
                unassigned.push(this.alive[i]);
        return unassigned;
    }

    public isAlive(creep: (Creep | string)): boolean {
        return this.listContainsCreep(creep, this.alive);
    }
        
    public isSpawning(creep: (Creep | string)): boolean {
        return this.listContainsCreep(creep, this.spawning);
    }
        
    public isAliveOrSpawning(creep: (Creep | string)): boolean {
        if (this.listContainsCreep(creep, this.spawning))
            return true;
        return this.listContainsCreep(creep, this.alive);
    }
    
    public wasBornThisTick(creep: (Creep | string)): boolean {
        return this.listContainsCreep(creep, this.bornThisTick);
    }
    
    public didDieRecently(creep: (Creep | string)): boolean {
        return this.listContainsCreep(creep, this.diedRecently);
    }
    
    public didDieLastTick(creep: (Creep | string)): boolean {
        return this.listContainsCreep(creep, this.diedLastTick);
    }
    

    private listContainsCreep(creep: (Creep | string), list: string[]) {        
        if (typeof creep != "string") 
            return this.listContainsCreep(creep.name, list);
        
        for (var i = 0; i < list.length; i++)
            if (list[i] == creep) 
                return true;

        return false;
    }

    private updatePopulation(): void {
        this.resetLists();
        
        for (var key in Memory.creeps) { //todo: eventually refactor so all populations update at once
            if (!this.creepFromThisColony(Memory.creeps[key]))
                continue;
            
            var creep = Game.creeps[key];
            if (!creep) { 
                if (!Memory.creeps[key].birthTick) { // creep scheduled for spawn
                    this.creepIsSpawning(key);
                } else { // creep is dead
                    var name = this.creepIsDead(key);
                    if (name)
                        delete Memory.creeps[key];
                }
                
            } else {
                if (creep.spawning) {
                    this.creepIsSpawning(key);
                } else {
                    this.creepIsAlive(key);
                }
            }
        }
    }

    private resetLists(): void {
        this.alive = [];
        this.spawning = [];
        this.bornThisTick = [];
        this.diedLastTick = [];
        this.diedRecently = [];
    }
   
    private creepIsAlive(creep: string): void {
        this.alive.push(creep);
    }

    private creepIsSpawning(creep: string): void {
        this.spawning.push(creep);
    }

    // returns the creep name if it's time to delete it
    private creepIsDead(creep: string): string {
        if (Memory.creeps[creep].deathTick <= 0) { // just died
            Memory.creeps[creep].deathTick = Game.time;
            this.diedLastTick.push(creep);
            
            global.events.creep.died(creep, this.colony.name);            
        }

        if (Game.time - Memory.creeps[creep].deathTick >= this.keepDeadCreepsFor)
            return creep;
        else
            this.diedRecently.push(creep);

        return null;
    }

    public creepFromThisColony(creep: CreepMemory) : boolean {
        for (var i = 0; i < this.colony.nest.spawners.length; i++)
            if (creep.colony == this.colony.name)
                return true;
        return false;
    }
}
