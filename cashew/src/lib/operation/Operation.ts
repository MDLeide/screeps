import { Colony } from "../colony/Colony";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export abstract class Operation {    
    private _creepRequirement: SpawnDefinition[];
    /** Just does some initialization to the base properties. Call it from an implementing
    class to save some typing.*/
    public static fromMemory<T extends Operation>(instance: T, memory: OperationMemory): T {
        instance.name = memory.name;
        instance.initialized = memory.initialized;
        instance.started = memory.started;
        instance.finished = memory.finished;
        instance.assignedCreeps = memory.assignedCreeps;
        return instance;
    }
    
    constructor(name: string) {
        this.name = name;
    }

    
    public name: string;    
    public initialized: boolean;
    public started: boolean;
    public finished: boolean;
    public assignedCreeps: string[];
    

    /** Called once, to initialize the operation - returns true if successful. */
    public init(colony: Colony): boolean {
        if (this.initialized)
            return true;
        if (!this.canInit(colony))
            return false;

        this.initialized = this.onInit(colony);
        return this.initialized;
    }

    /** Called once, to start the operation, and begin calls of execute. */
    public start(colony: Colony): boolean {        
        if (this.started)
            return true;
        if (!this.canStart(colony))
            return false;

        this.started = this.onStart(colony);
        return this.started;
    }

    /** Allows the operation to finalize. */
    public finish(colony: Colony): void {
        this.onFinish(colony);
    }


    /** Assigns a creep to this operation. */
    public assignCreep(creepName: string): void {
        this.assignedCreeps.push(creepName);
    }

    /** Removes a creep from this operation. */    
    public removeCreep(creepName: string) {        
        var index = -1;
        for (var i = 0; i < this.assignedCreeps.length; i++) {
            if (this.assignedCreeps[i] == creepName) {
                index = i;
                break;
            }
        }
        
        if (index >= 0) 
            this.assignedCreeps.splice(index, 1);        
    }

    /** Gets the total spawn requirements for the operation. */
    public getTotalCreepRequirement(colony: Colony): SpawnDefinition[] {
        if (!this._creepRequirement)
            this._creepRequirement = this.onGetCreepRequirement(colony);
        return this._creepRequirement;
    }
    
    /** Gets the remaining spawn requirements for the operation. */
    public getRemainingCreepSpawnRequirements(colony: Colony): SpawnDefinition[] {
        //todo: we don't have to recalculate this each time if we keep track of it via assigned, removed, and dead creeps
        var req = this.getTotalCreepRequirement(colony);
        var toSpawn: SpawnDefinition[] = [];

        var toSkip: number[] = []; // used to make sure a single assigned creep does not count
        // for multiples when comparing assigned vs required        
        // we will check each requirement against the list of assigned creeps

        for (var i = 0; i < req.length; i++) {
            var found = false;
            for (var j = 0; j < this.assignedCreeps.length; j++) {
                if (this.doSkip(j, toSkip))
                    continue;

                var assignedCreepRole = Memory.creeps[this.assignedCreeps[j]].roleId;
                if (req[i].roleId == assignedCreepRole) {
                    toSkip.push(j);
                    found = true;
                    break;
                }
            }
            if (!found) 
                toSpawn.push(req[i]);            
        }
        return toSpawn;
    }


    public load(): void {
        this.onLoad();
    }

    /** Provides early-tick opportunity to update state. Will be called on all colonies and operations prior to Execute being called. */
    public update(colony: Colony): void {
        this.cleanDeadCreeps(colony);
        this.onUpdate(colony);
    }

    /** Main operation logic should execute here. */
    public execute(colony: Colony): void {
        for (var i = 0; i < this.assignedCreeps.length; i++) {
            var creep = Game.creeps[this.assignedCreeps[i]];
            if (!creep.spawning)
                creep.nut.role.execute();
        }
        this.onExecute(colony);
    }

    /** Called after all operatoins have executed. */
    public cleanup(colony: Colony): void {
        this.onCleanup(colony);
    }

    public save(): OperationMemory {
        var memory = this.onSave();
        if (!memory) {
            memory = {
                name: this.name,
                initialized: this.initialized,
                started: this.started,
                finished: this.finished,
                assignedCreeps: this.assignedCreeps
            }
        }
        return memory;
    }

    /** Ensures we don't have any dead creeps assigned to the operation. */
    private cleanDeadCreeps(colony: Colony) {
        var toRemove: number[] = [];
        for (var i = 0; i < this.assignedCreeps.length; i++)
            if (colony.population.didDieRecently(this.assignedCreeps[i]))
                toRemove.push(i);
        for (var i = toRemove.length - 1; i >= 0; i--)
            this.assignedCreeps.splice(toRemove[i], 1);
    }

    // helper
    private doSkip(index: number, array: number[]): boolean {
        for (var i = 0; i < array.length; i++)
            if (array[i] == index)
                return true;
        return false;
    }


    public abstract canInit(colony: Colony): boolean;
    public abstract canStart(colony: Colony): boolean;
    public abstract isFinished(colony: Colony): boolean;

    /** Called once, to initialize the operation - returns true if successful. */
    protected abstract onInit(colony: Colony): boolean;
    /** Called once, to start the operation, and begin calls of execute. */
    protected abstract onStart(colony: Colony): boolean;
    /** Called once, after isFinished() returns true. */
    protected abstract onFinish(colony: Colony): boolean;

    /** Update game object references. */
    protected abstract onLoad(): void;
    /** Provides early-tick opportunity to update state. Will be called on all colonies and operations prior to Execute being called. */
    protected abstract onUpdate(colony: Colony): void;
    /** Main operation logic should execute here. */
    protected abstract onExecute(colony: Colony): void;
    /** Called after all operatoins have executed. */
    protected abstract onCleanup(colony: Colony): void;

    /** Gets the creeps that this operation wants. */
    protected abstract onGetCreepRequirement(colony: Colony): SpawnDefinition[];

    /** Allows the concrete class to provide an extended memory object.
    Optionally it can return null for defualt Operation memory. */
    protected abstract onSave(): OperationMemory;
}

