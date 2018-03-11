import { Colony } from "../colony/Colony"
import { Operation, InitStatus, StartStatus, OperationStatus } from "./Operation"
import { Assignment } from "./Assignment"
import { OperationRepository } from "./OperationRepository";

export class OperationGroup {
    public static fromMemory(memory: OperationGroupMemory) {
        let ops: Operation[] = [];
        for (var i = 0; i < memory.operations.length; i++) 
            ops.push(OperationRepository.load(memory.operations[i]));

        return new this(ops);
    }

    constructor(operations: Operation[]) {
        this.operations = [];
        for (var i = 0; i < operations.length; i++)
            this.operations.push(operations[i]);
    }    


    public operations: Operation[];
    public canceled: Operation[] = [];


    public load(): void {
        for (var i = 0; i < this.operations.length; i++)
            if (!this.operations[i].finished)
                this.operations[i].load();
    }

    public update(colony: Colony): void {
        // finish operations
        for (var i = 0; i < this.operations.length; i++)
            if (this.operations[i].status == OperationStatus.Started)
                if (this.operations[i].isFinished(colony))
                    this.operations[i].finish(colony);

        // update operations
        for (var i = 0; i < this.operations.length; i++)
            if (!this.operations[i].finished)
                this.operations[i].update(colony);
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.operations.length; i++) {
            if (this.operations[i].finished) {
                continue;
            } else if (this.operations[i].status == OperationStatus.Started) {
                continue; // we'll check for finished ops again in cleanup
            } else if (this.operations[i].needsStart && this.operations[i].canStart(colony)) {
                this.operations[i].start(colony);
            } else if (this.operations[i].needsInit && this.operations[i].canInit(colony))
                this.operations[i].init(colony);
        }
        
        for (var i = 0; i < this.operations.length; i++)
            if (this.operations[i].needsCreepSpawnCheck)
                this.getCreepsForOperation(this.operations[i], colony);
        
        for (var i = 0; i < this.operations.length; i++)
            if (this.operations[i].status == OperationStatus.Started)
                this.operations[i].execute(colony);
    }

    public cleanup(colony: Colony) {
        for (var i = 0; i < this.operations.length; i++) {
            if (this.operations[i].finished) { // remove operations one tick after they've finished
                // skip if it was canceled this tick
                // this is to allow something that might be interested in it being finished the chance to see it
                // in case it were canceled, for instance, during execution, and the consumer checks in update
                if (this.canceled.indexOf(this.operations[i]) >= 0)
                    continue;
                this.operations.splice(i--, 1);
            }
            else {
                this.operations[i].cleanup(colony);
            }
        }
        
        for (var i = 0; i < this.operations.length; i++) {
            if (this.operations[i].status == OperationStatus.Started && !this.operations[i].finished)
                if (this.operations[i].isFinished(colony))
                    this.operations[i].finish(colony);
        }
    }


    public addOperation(operation: Operation): void {
        this.operations.push(operation);
    }

    public cancelOperation(operation: Operation): void {
        operation.cancel();
        this.canceled.push(operation);
    }

    public cancelOperationByType(type: OperationType): void {
        for (var i = 0; i < this.operations.length; i++)
            if (this.operations[i].type == type)
                this.cancelOperation(this.operations[i]);        
    }

    
     /** Spawns creeps required for an operation. */
    private getCreepsForOperation(op: Operation, colony: Colony): void {
        var openAssignments = op.getUnfilledAssignments();
        
        for (var i = 0; i < openAssignments.length; i++) {
            let creep = this.getCreepForAssignment(openAssignments[i], colony);
            if (creep)
                op.assignCreep(openAssignments[i], creep);
        }

        let replacements = op.getAssignmentsNeedingReplacements();

        for (var i = 0; i < replacements.length; i++) {
            let creep = this.getCreepForAssignment(replacements[i], colony);
            if (creep)
                op.assignReplacement(replacements[i], creep);
        }
    }

    /**
     * Tries to find or spawn a creep for an assignment.
     * @param assignment
     * @param colony
     */
    private getCreepForAssignment(assignment: Assignment, colony: Colony): string {
        let unassignedCreep = this.getUnassignedCreep(assignment, colony);
        if (unassignedCreep)
            return unassignedCreep;

        if (!colony.canSpawn(assignment.body))
            return null;

        let response = colony.spawnCreep(assignment.body);
        if (response)
            return response.name;
        return null;
    }

    /**
     * Tries to find a creep without an operation that matches the assignment's body requirements.
     * @param assignment
     * @param colony
     */
    private getUnassignedCreep(assignment: Assignment, colony: Colony): string {
        var unassigned = colony.population.notAssignedToOperation();
        for (var i = 0; i < unassigned.length; i++) {
            var name = unassigned[i];
            if (Memory.creeps[name].body == assignment.body.type) 
                return name;            
        }
        return null;
    }

    public save(): OperationGroupMemory {
        let opMemory: OperationMemory[] = [];
        for (var i = 0; i < this.operations.length; i++)
            opMemory.push(this.operations[i].save());

        return {
            operations: opMemory
        };
    }
}
