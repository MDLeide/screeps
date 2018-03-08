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
        instance.initializedStatus = memory.initializedStatus;
        instance.startedStatus = memory.startedStatus;
        instance.status = memory.operationStatus;
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
    public initializedStatus: InitStatus = InitStatus.Uninitialized;
    public startedStatus: StartStatus = StartStatus.Unstarted;
    public status: OperationStatus = OperationStatus.New;
    public assignments: Assignment[]; // filled if creep name is not blank
    public get finished(): boolean {
        return this.status == OperationStatus.Complete ||
            this.status == OperationStatus.Canceled ||
            this.status == OperationStatus.FailedInit ||
            this.status == OperationStatus.FailedOther ||
            this.status == OperationStatus.FailedStart;
    }
    public get needsInit(): boolean {
        return this.status == OperationStatus.New ||
            this.status == OperationStatus.AwaitingReinit;  
    }
    public get needsStart(): boolean {
        return this.status == OperationStatus.Initialized ||
            this.status == OperationStatus.AwaitingRestart;
    }
    public get needsCreepSpawnCheck() {
        return this.status == OperationStatus.Initialized ||
            this.status == OperationStatus.AwaitingRestart ||
            this.status == OperationStatus.Started;
    }


    public abstract canInit(colony: Colony): boolean;
    public abstract canStart(colony: Colony): boolean;
    public abstract isFinished(colony: Colony): boolean;

    protected abstract onAssignment(assignment: Assignment): void;
    protected abstract onReplacement(assignment: Assignment): void;
    protected abstract onRelease(assignment: Assignment): void;

    protected abstract onInit(colony: Colony): InitStatus;
    protected abstract onStart(colony: Colony): StartStatus;
    protected abstract onFinish(colony: Colony): boolean;
    protected abstract onCancel(): void;

    protected abstract onLoad(): void;
    protected abstract onUpdate(colony: Colony): void;
    protected abstract onExecute(colony: Colony): void;
    protected abstract onCleanup(colony: Colony): void;

    protected abstract onSave(): OperationMemory;


    public load(): void {
        this.onLoad();
    }
        
    public update(colony: Colony): void {
        this.cleanDeadCreeps(colony);
        this.onUpdate(colony);
    }
        
    public execute(colony: Colony): void {
        this.onExecute(colony);
    }
    
    public cleanup(colony: Colony): void {
        this.onCleanup(colony);
    }


    public init(colony: Colony): InitStatus {
        if (this.initializedStatus == InitStatus.Initialized || this.initializedStatus == InitStatus.Failed) {
            return this.initializedStatus;
        }            
        if (!this.canInit(colony)) {
            this.initializedStatus = InitStatus.TryAgain;
            global.events.operation.initAgain(this.type);
            return this.initializedStatus;
        }            

        this.initializedStatus = this.onInit(colony);

        if (this.initializedStatus == InitStatus.Initialized) {
            this.status = OperationStatus.Initialized;
            global.events.operation.init(this.type);
        } else if (this.initializedStatus == InitStatus.TryAgain) {
            this.status = OperationStatus.AwaitingReinit;
            global.events.operation.initAgain(this.type);
        } else if (this.initializedStatus == InitStatus.Partial) {
            this.status = OperationStatus.AwaitingReinit;
            global.events.operation.initPartial(this.type);
        } else if (this.initializedStatus == InitStatus.Failed) {
            this.status = OperationStatus.FailedInit;
            global.events.operation.initFailed(this.type);
        }

        return this.initializedStatus;
    }
    
    public start(colony: Colony): StartStatus {                
        if (this.startedStatus == StartStatus.Started || this.startedStatus == StartStatus.Failed)
            return this.startedStatus;
        if (!this.canStart(colony)) {
            this.startedStatus = StartStatus.TryAgain;
            this.status = OperationStatus.AwaitingRestart;
            return this.startedStatus;
        }            

        this.startedStatus = this.onStart(colony);

        if (this.startedStatus == StartStatus.Started) {
            this.status = OperationStatus.Started;
            global.events.operation.start(this.type);
        } else if (this.startedStatus == StartStatus.TryAgain) {
            this.status = OperationStatus.AwaitingRestart;
            global.events.operation.startAgain(this.type);            
        } else if (this.startedStatus == StartStatus.Partial) {
            this.status = OperationStatus.AwaitingRestart;
            global.events.operation.startPartial(this.type);
        } else if (this.startedStatus == StartStatus.Failed) {
            this.status = OperationStatus.FailedStart;
            global.events.operation.startFailed(this.type);
        }

        return this.startedStatus;
    }
    
    public finish(colony: Colony): void {
        
        if (this.onFinish(colony)) {
            for (var i = 0; i < this.assignments.length; i++) {
                if (this.assignments[i].creepName)
                    this.releaseAssignment(this.assignments[i]);
            }
            this.status = OperationStatus.Complete;
            global.events.operation.finish(this.type);
        }
        else {
            this.status = OperationStatus.FailedOther;
            global.events.operation.failedToFinish(this.type);
        }
    }
    
    public cancel(): void {
        this.onCancel();
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName)
                this.releaseAssignment(this.assignments[i]);
        }

        this.status = OperationStatus.Canceled;
        global.events.operation.cancel(this.type);
        //todo: events for cancelation
    }


    /**
     * Assigns a creep the the operation as a replacement. Creeps that are not yet available, because they are either
     * spawning or queued for spawn, can be assigned in this fashion. The creep must have an entry
     * already created in Memory.creeps. Returns true if succesful.
     * @param assignment
     * @param creepName
     */
    public assignReplacement(assignment: Assignment, creepName: string): boolean {
        if (this.assignments.indexOf(assignment) < 0) {
            global.events.operation.creepReplacementAssignmentFailed(this.type, creepName, assignment.body.type, "Assignment does not exist on operation");
            return false;
        }

        if (!assignment.replacementOpen()) {
            global.events.operation.creepReplacementAssignmentFailed(this.type, creepName, assignment.body.type, "Assignment does not require replacement");
            return false;
        }

        let creepMemory = Memory.creeps[creepName];
        if (!creepMemory) {
            global.events.operation.creepReplacementAssignmentFailed(this.type, creepName, assignment.body.type, "Creep not found in memory");
            return false;
        }            

        assignment.replacementName = creepName;
        creepMemory.operation = this.type;
        this.onReplacement(assignment);
        global.events.operation.creepReplacementAssigned(this.type, creepName, assignment.body.type);
        return true;
    }

    /**
     * Assigns a creep to the operation. Creeps that are not yet available, because they are either
     * spawning or queued for spawn, can be assigned in this fashion. The creep must have an entry
     * already created in Memory.creeps. Returns true if succesful.
     * @param creep
     */
    public assignCreep(assignment: Assignment, creepName: string): boolean {
        if (this.assignments.indexOf(assignment) < 0) {
            global.events.operation.creepAssignmentFailed(this.type, creepName, assignment.body.type, "Assignment does not exist on operation");
            return false;
        }

        if (assignment.isFilled()) {
            global.events.operation.creepAssignmentFailed(this.type, creepName, assignment.body.type, "Assignment already filled");
            return false;
        }

        let creepMemory = Memory.creeps[creepName];
        if (!creepMemory) {
            global.events.operation.creepAssignmentFailed(this.type, creepName, assignment.body.type, "Creep not found in memory");
            return false;
        }

        assignment.creepName = creepName;
        creepMemory.operation = this.type;
        this.onAssignment(assignment);
        global.events.operation.creepAssigned(this.type, creepName, assignment.body.type);
        return true;
    }

    /**
     * Releases the creep from an assignment. If there is a replacement creep on the assignment,
     * it will take over the primary position. Returns true if succesful.
     * @param assignment
     */
    public releaseAssignment(assignment: Assignment): boolean {
        if (this.assignments.indexOf(assignment) < 0) {
            global.events.operation.assignmentReleaseFailed(this.type, assignment.creepName, assignment.body.type, "Assignment does not exist on operation");
            return false;
        }

        if (assignment.isOpen()) {
            global.events.operation.assignmentReleaseFailed(this.type, assignment.creepName, assignment.body.type, "Assignment already open");
            return false;
        }

        let creepName = assignment.creepName;
        let bodyType = assignment.body.type;
        this.onRelease(assignment);
        assignment.release();
        if (Memory.creeps[creepName])
            Memory.creeps[creepName].operation = undefined;

        global.events.operation.assignmentReleased(this.type, creepName, bodyType);
        return true;
    }


    /**
     * Gets all assignments which require a replacement to be provided immediately.
     */
    public getAssignmentsNeedingReplacements(): Assignment[] {
        let replacements: Assignment[] = [];
        for (var i = 0; i < this.assignments.length; i++) {
            let assignment = this.assignments[i];

            if (assignment.isFilled() && assignment.replacementOpen()) {
                let creep = Game.creeps[this.assignments[i].creepName];

                if (creep && creep.ticksToLive <= this.assignments[i].replaceAt)
                    replacements.push(this.assignments[i]);
            }
        }
        return replacements;
    }

    public getUnfilledAssignments(): Assignment[] {
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


    protected getAssignmentMemory(): AssignmentMemory[] {
        var assignmentMemory: AssignmentMemory[] = [];
        for (var i = 0; i < this.assignments.length; i++)
            assignmentMemory.push(this.assignments[i].save());
        return assignmentMemory;
    }


    private cleanDeadCreeps(colony: Colony) {
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].creepName) {
                if (!colony.population.isAliveOrSpawning(this.assignments[i].creepName))
                    this.releaseAssignment(this.assignments[i]);
            }            
        }        
    }


    public save(): OperationMemory {
        var memory = this.onSave();
        if (memory)
            return memory;

        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory()
        };
    }    
}

export enum InitStatus {
    Uninitialized,
    Initialized,
    Partial,
    TryAgain,
    Failed
}

export enum StartStatus {
    Unstarted,
    Started,
    Partial,
    TryAgain,
    Failed
}

export enum OperationStatus {
    New,
    AwaitingReinit,
    Initialized,
    AwaitingRestart,
    Started,
    Complete,
    Canceled,
    FailedInit,
    FailedStart,
    FailedOther
}
