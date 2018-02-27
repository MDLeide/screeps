import { Colony } from "../colony/Colony"
import { Operation } from "./Operation"
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
    
    public addOperation(operation: Operation): void {
        this.operations.push(operation);
    }

    public cancelOperation(operation: Operation): void {
        operation.cancel();
        this.canceled.push(operation);
    }
    
    public load(): void {
        for (var i = 0; i < this.operations.length; i++) 
            if (!this.operations[i].finished)
                this.operations[i].load();
    }

    public update(colony: Colony): void {
        for (var i = 0; i < this.operations.length; i++)
            if (!this.operations[i].finished)
                this.operations[i].update(colony);

        for (var i = 0; i < this.operations.length; i++) {
            if (this.operations[i].finished) {
                continue;
            } else if (this.operations[i].started) {
                continue; // we'll check for finished ops in cleanup
            } else if (this.operations[i].initialized) {
                if (this.operations[i].canStart(colony))
                    this.operations[i].start(colony);
            } else {
                if (this.operations[i].canInit(colony))
                    this.operations[i].init(colony);
            }                
        }                
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.operations.length; i++) 
            if (this.operations[i].initialized && !this.operations[i].finished)
                this.getCreepsForOperation(this.operations[i], colony);
        

        for (var i = 0; i < this.operations.length; i++)
            if (this.operations[i].started && !this.operations[i].finished)
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

        for (var i = 0; i < this.operations.length; i++) 
            if (this.operations[i].started) 
                if (this.operations[i].isFinished(colony)) 
                    this.operations[i].finish(colony);
    }
    
     /** Spawns creeps required for an operation. */
    private getCreepsForOperation(op: Operation, colony: Colony): void {
        var openAssignments = op.getUnfilledAssignments(colony);
        
        for (var i = 0; i < openAssignments.length; i++) {
            var unassignedCreep = this.getUnassignedCreep(openAssignments[i], colony);
            if (unassignedCreep) {
                op.assignCreep({ name: unassignedCreep, bodyType: openAssignments[i].body.type });
                continue;
            }
            
            if (!colony.canSpawn(openAssignments[i].body))
                continue;

            var response = colony.spawnCreep(openAssignments[i].body);
            if (response)
                op.assignCreep({ name: response.name, bodyType: openAssignments[i].body.type });
        }
    }

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
