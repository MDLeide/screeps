import { Assignment } from "./Assignment";
import { Colony } from "../colony/Colony";
import { Body } from "../creep/Body";
import { CreepController } from "../creep/CreepController";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

export abstract class Operation {        
    /** Just does some initialization to the base properties. Call it from an implementing
    class to save some typing.*/
    public static fromMemory(memory: OperationMemory, instance: Operation): Operation {
        instance.type = memory.type;
        instance.initialized = memory.initialized;
        instance.started = memory.started;
        instance.finished = memory.finished;
        instance.assignments = [];
        for (var i = 0; i < memory.assignments.length; i++) 
            instance.assignments.push(Assignment.fromMemory(memory.assignments[i]));        
        return instance;
    }

    
    constructor(type: OperationType, assignments: Assignment[]) {
        this.type = type;
        this.assignments = assignments;
    }

    
    public type: OperationType;
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
        if (this.initialized)
            global.events.operation.init(this.type);
        else
            global.events.operation.failedToInit(this.type);

        return this.initialized;
    }
    
    public start(colony: Colony): boolean {        
        if (this.started)
            return true;
        if (!this.canStart(colony))
            return false;

        this.started = this.onStart(colony);
        if (this.started)
            global.events.operation.start(this.type);
        else
            global.events.operation.failedToStart(this.type);

        return this.started;
    }
    
    public finish(colony: Colony): void {
        this.finished = this.onFinish(colony);
        if (this.finished) {
            for (var i = 0; i < this.assignments.length; i++) {
                if (this.assignments[i].creepName != "")
                    this.releaseCreep(this.assignments[i].creepName);
            }

            global.events.operation.finish(this.type);
        }
        else {
            global.events.operation.failedToFinish(this.type);
        }
    }

    public cancel(): void {
        this.onCancel();
        this.finished = true;
        //todo: events for cancelation
    }

    // creep may not yet be available via Game.creeps - may have just requested spawning this tick
    public assignCreep(creep: { name: string, bodyType: BodyType }): void {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].isFilled())
                continue;

            if (this.assignments[i].body.type != creep.bodyType)
                continue;
            
            this.assignments[i].creepName = creep.name;
            Memory.creeps[creep.name].operation = this.type;

            this.onAssignment(this.assignments[i]);
            
            global.events.operation.creepAssigned(this.type, creep.name, creep.bodyType);
            return;
        }
        global.events.operation.creepAssignmentFailed(this.type, creep.name, creep.bodyType);
    }
    
    public releaseCreep(creepName: string): void {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName == creepName) {
                this.onRelease(this.assignments[i]);

                this.assignments[i].release();
                Memory.creeps[creepName].operation = "";
                
                global.events.operation.creepReleased(this.type, creepName, Memory.creeps[creepName].body);
                return;
            }
        }
        global.events.operation.creepReleaseFailed(this.type, creepName, Memory.creeps[creepName].body);
    }
    
    public getUnfilledAssignments(colony: Colony): Assignment[] {
        var unfilled: Assignment[] = [];
        for (var i = 0; i < this.assignments.length; i++) 
            if (!this.assignments[i].creepName)
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
                type: this.type,
                initialized: this.initialized,
                started: this.started,
                finished: this.finished,
                assignments: this.getAssignmentMemory()
            };
        }
        return memory;
    }

    protected getAssignmentMemory(): AssignmentMemory[] {
        var assignmentMemory: AssignmentMemory[] = [];
        for (var i = 0; i < this.assignments.length; i++)
            assignmentMemory.push(this.assignments[i].save());
        return assignmentMemory;
    }
        
    /** Ensures we don't have any dead creeps assigned to the operation. */
    private cleanDeadCreeps(colony: Colony) {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName) {
                if (!colony.population.isAliveOrSpawning(this.assignments[i].creepName))
                    this.releaseCreep(this.assignments[i].creepName);                
            }            
        }        
    }
    
    public abstract canInit(colony: Colony): boolean;
    public abstract canStart(colony: Colony): boolean;
    public abstract isFinished(colony: Colony): boolean;

    protected abstract onAssignment(assignment: Assignment): void;    
    protected abstract onRelease(assignment: Assignment): void;

    /** Called once, to initialize the operation - returns true if successful. */
    protected abstract onInit(colony: Colony): boolean;
    /** Called once, to start the operation, and begin calls of execute. */
    protected abstract onStart(colony: Colony): boolean;
    /** Called once, after isFinished() returns true. */
    protected abstract onFinish(colony: Colony): boolean;
    protected abstract onCancel(): void;

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
