import { Assignment } from "./Assignment";
import { Colony } from "../colony/Colony";
import { Body } from "../spawn/Body";

export abstract class Operation {        
    /** Just does some initialization to the base properties. Call it from an implementing
    class to save some typing.*/
    public static fromMemory<T extends Operation>(memory: OperationMemory, instance: T): Operation {
        instance.name = memory.name;
        instance.initialized = memory.initialized;
        instance.started = memory.started;
        instance.finished = memory.finished;
        instance.assignments = [];
        for (var i = 0; i < memory.assignments.length; i++) 
            instance.assignments.push(Assignment.fromMemory(memory.assignments[i]));        
        return instance;
    }

    
    constructor(name: string, assignments: Assignment[]) {
        this.name = name;        
        this.assignments = assignments;
    }

    
    public name: string;    
    public initialized: boolean;
    public started: boolean;
    public finished: boolean;
    public assignments: Assignment[]; // filled if creep name is not blank
    
        
    public init(colony: Colony): boolean {
        if (this.initialized)
            return true;
        if (!this.canInit(colony))
            return false;

        this.initialized = this.onInit(colony);
        return this.initialized;
    }
    
    public start(colony: Colony): boolean {        
        if (this.started)
            return true;
        if (!this.canStart(colony))
            return false;

        this.started = this.onStart(colony);
        return this.started;
    }
    
    public finish(colony: Colony): void {
        this.onFinish(colony);
    }


    public assignCreep(creep: { name: string, bodyName: string }): void {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName == "" && this.assignments[i].body.name == creep.bodyName) {
                this.assignments[i].creepName = creep.name;
                Memory.creeps[creep.name].roleId = this.assignments[i].roleId;
                return;
            }
        }
    }
    
    public removeCreep(creepName: string) {
        for (var i = 0; i < this.assignments.length; i++)
            if (this.assignments[i].creepName == creepName)
                this.assignments[i].creepName = "";
    }
    
    public getUnfilledAssignments(colony: Colony): Assignment[] {
        var unfilled: Assignment[] = [];
        for (var i = 0; i < this.assignments.length; i++) 
            if (this.assignments[i].creepName == "")
                unfilled.push(this.assignments[i]);
        return unfilled;
    }
    
    public getFilledAssignmentCount(): number {
        var count = 0;
        for (var i = 0; i < this.assignments.length; i++) 
            if (this.assignments[i].creepName != "")
                count++;
        return count;
    }
        

    //**                    **//
    //** Update Loop        **//
    //**                    **//

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
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName == "")
                continue;

            var creep = Game.creeps[this.assignments[i].creepName];
            if (creep && !creep.spawning)
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
            var assignmentMemory: AssignmentMemory[] = [];
            for (var i = 0; i < this.assignments.length; i++) 
                assignmentMemory.push(this.assignments[i].save());
            
            memory = {
                name: this.name,
                initialized: this.initialized,
                started: this.started,
                finished: this.finished,
                assignments: assignmentMemory
            };
        }
        return memory;
    }

    //**                    **//
    //** End Update Loop    **//
    //**                    **//

    /** Ensures we don't have any dead creeps assigned to the operation. */
    private cleanDeadCreeps(colony: Colony) {
        for (var i = 0; i < this.assignments.length; i++)
            if (!colony.population.isAliveOrSpawning(this.assignments[i].creepName))
                this.assignments[i].creepName = "";

    }

    // helper
    private doSkip(index: number, array: number[]): boolean {
        for (var i = 0; i < array.length; i++)
            if (array[i] == index)
                return true;
        return false;
    }

    //**                    **//
    //** Abstracts          **//
    //**                    **//

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
    
    /** Allows the concrete class to provide an extended memory object.
    Optionally it can return null for defualt Operation memory. */
    protected abstract onSave(): OperationMemory;
}

