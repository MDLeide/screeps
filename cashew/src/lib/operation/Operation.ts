import { Assignment } from "./Assignment";
import { Colony } from "../colony/Colony";
import { Body } from "../spawn/Body";
import { CreepController } from "../creep/CreepController";
import { CreepControllerRepository } from "../creep/CreepControllerRepository";

export abstract class Operation {        
    /** Just does some initialization to the base properties. Call it from an implementing
    class to save some typing.*/
    public static fromMemory<T extends Operation>(memory: OperationMemory, instance: T): Operation {
        instance.type = memory.type;
        instance.initialized = memory.initialized;
        instance.started = memory.started;
        instance.finished = memory.finished;
        instance.assignments = [];
        instance.cancelMilestoneId = memory.cancelMilestoneId;
        instance.controllers = {};
        for (var key in memory.controllers)
            instance.controllers[key] = CreepControllerRepository.load(memory.controllers[key]);

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
    public controllers: { [creepName: string]: CreepController } = {};

    // this really, really doesn't belong here, but it was way easier to implement like this
    public cancelMilestoneId: string = "";
    /** Indicates that an inheriting class will manually control the creeps. */
    protected manualCreepControl: boolean = false;

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
                    this.removeCreep(this.assignments[i].creepName);
            }

            global.events.operation.finish(this.type);
        }
        else {
            global.events.operation.failedToFinish(this.type);
        }
    }

    // creep may not yet be available via Game.creeps - may have just requested spawning this tick
    public assignCreep(creep: { name: string, bodyName: string }): void {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].isFilled())
                continue;

            if (this.assignments[i].body.type != creep.bodyName)
                continue;
            
            this.assignments[i].creepName = creep.name;
            Memory.creeps[creep.name].operation = this.type;            

            this.controllers[creep.name] = this.onAssignment(this.assignments[i]);

            global.events.operation.creepAssigned(this.type, creep.name, creep.bodyName);
            return;
        }
        global.events.operation.creepAssignmentFailed(this.type, creep.name, creep.bodyName);
    }
    
    public removeCreep(creepName: string) {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName == creepName) {
                this.assignments[i].release();
                Memory.creeps[creepName].operation = "";
                if (this.controllers[creepName])
                    delete this.controllers[creepName];

                global.events.operation.creepReleased(this.type, creepName, Memory.creeps[creepName].body);
                return;
            }
        }
        global.events.operation.creepReleaseFailed(this.type, creepName, Memory.creeps[creepName].body);
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
        
    public load(): void {
        this.onLoad();
    }

    /** Provides early-tick opportunity to update state. Will be called on all colonies and operations prior to Execute being called. */
    public update(colony: Colony): void {        
        this.cleanDeadCreeps(colony);

        if (!this.manualCreepControl) {
            for (var i = 0; i < this.assignments.length; i++) {
                if (this.assignments[i].creepName == "")
                    continue;

                var creep = Game.creeps[this.assignments[i].creepName];
                if (creep && !creep.spawning) {
                    let controller = this.controllers[creep.name];
                    if (controller)
                        controller.update(creep);
                }

            }
        }

        this.onUpdate(colony);
    }

    /** Main operation logic should execute here. */
    public execute(colony: Colony): void {
        if (!this.manualCreepControl) {
            for (var i = 0; i < this.assignments.length; i++) {
                if (this.assignments[i].creepName == "")
                    continue;

                var creep = Game.creeps[this.assignments[i].creepName];
                if (creep && !creep.spawning) {
                    let controller = this.controllers[creep.name];
                    if (controller)
                        controller.execute(creep);
                }
                    
            }
        }

        this.onExecute(colony);
    }

    /** Called after all operatoins have executed. */
    public cleanup(colony: Colony): void {
        if (!this.manualCreepControl) {
            for (var i = 0; i < this.assignments.length; i++) {
                if (this.assignments[i].creepName == "")
                    continue;

                var creep = Game.creeps[this.assignments[i].creepName];
                if (creep && !creep.spawning) {
                    let controller = this.controllers[creep.name];
                    if (controller)
                        controller.cleanup(creep);
                }

            }
        }

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
                cancelMilestoneId: this.cancelMilestoneId,
                assignments: this.getAssignmentMemory(),
                controllers: this.getControllerMemory()
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

    protected getControllerMemory(): { [creepName: string]: CreepControllerMemory } {
        var mem = {};
        for (var key in this.controllers)
            mem[key] = this.controllers[key].save();
        return mem;
    }
    
    /** Ensures we don't have any dead creeps assigned to the operation. */
    private cleanDeadCreeps(colony: Colony) {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName) {
                if (!colony.population.isAliveOrSpawning(this.assignments[i].creepName))
                    this.assignments[i].release();
                if (this.controllers[this.assignments[i].creepName])
                    delete this.controllers[this.assignments[i].creepName];
            }            
        }
        
    }
    
    public abstract canInit(colony: Colony): boolean;
    public abstract canStart(colony: Colony): boolean;
    public abstract isFinished(colony: Colony): boolean;

    protected abstract onAssignment(assignment: Assignment): CreepController;

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

