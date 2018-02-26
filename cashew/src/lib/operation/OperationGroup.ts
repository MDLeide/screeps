import { Colony } from "../colony/Colony"
import { Operation } from "./Operation"
import { Assignment } from "./Assignment"
import { OperationRepository } from "./OperationRepository";

export class OperationGroup {
    public static fromMemory(memory: OperationGroupMemory) {
        var group = new this([]);
        for (var i = 0; i < memory.newOperations.length; i++)
            group.newOperations.push(OperationRepository.load(memory.newOperations[i]));

        for (var i = 0; i < memory.initializedOperations.length; i++)
            group.initializedOperations.push(OperationRepository.load(memory.initializedOperations[i]));

        for (var i = 0; i < memory.startedOperations.length; i++)
            group.startedOperations.push(OperationRepository.load(memory.startedOperations[i]));

        for (var i = 0; i < memory.completedOperations.length; i++) 
            group.completedOperations.push(memory.completedOperations[i]);

        return group;
    }

    constructor(operations: Operation[]) {
        this.newOperations = [];
        for (var i = 0; i < operations.length; i++) 
            this.newOperations.push(operations[i]);
        this.initializedOperations = [];
        this.startedOperations = [];
        this.completedOperations = [];
    }    

    
    public newOperations: Operation[];
    public initializedOperations: Operation[];
    public startedOperations: Operation[];
    public completedOperations: OperationType[];

    public addOperation(operation: Operation): void {
        this.newOperations.push(operation);
    }

    public checkForCanceledOperations(milestoneId: string, colony: Colony): void {
        for (var i = 0; i < this.newOperations.length; i++) {
            if (this.newOperations[i].cancelMilestoneId == milestoneId) {
                this.newOperations[i].finish(colony);
                this.completedOperations.push(this.newOperations[i].type);
                this.newOperations.splice(i--, 1);
            }
        }

        for (var i = 0; i < this.initializedOperations.length; i++) {
            if (this.initializedOperations[i].cancelMilestoneId == milestoneId) {
                this.initializedOperations[i].finish(colony);
                this.completedOperations.push(this.initializedOperations[i].type);
                this.initializedOperations.splice(i--, 1);
            }
        }

        for (var i = 0; i < this.startedOperations.length; i++) {
            if (this.startedOperations[i].cancelMilestoneId == milestoneId) {
                this.startedOperations[i].finish(colony);
                this.completedOperations.push(this.startedOperations[i].type);
                this.startedOperations.splice(i--, 1);
            }
        }        
    }

    public load(): void {
        for (var i = 0; i < this.newOperations.length; i++)
            this.newOperations[i].load();

        for (var i = 0; i < this.initializedOperations.length; i++)
            this.initializedOperations[i].load();

        for (var i = 0; i < this.startedOperations.length; i++)
            this.startedOperations[i].load();
    }

    public update(colony: Colony): void {
        // once an operation has moved to the next phase, we will remove
        // it from the previous array

        for (var i = 0; i < this.newOperations.length; i++) 
            this.newOperations[i].update(colony);        

        for (var i = 0; i < this.initializedOperations.length; i++) 
            this.initializedOperations[i].update(colony);
        
        for (var i = 0; i < this.startedOperations.length; i++) 
            this.startedOperations[i].update(colony);

                
        for (var i = 0; i < this.newOperations.length; i++) {
            var op = this.newOperations[i];
            if (op.canInit(colony)) {
                if (op.init(colony)) {                    
                    this.initializedOperations.push(op);
                    this.newOperations.splice(i--, 1);
                }
            }
        }
        
        for (var i = 0; i < this.initializedOperations.length; i++) {
            var op = this.initializedOperations[i];
            if (op.canStart(colony)) {
                if (op.start(colony)) {
                    this.startedOperations.push(op);
                    this.initializedOperations.splice(i--, 1);
                }
            }
        }        
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.initializedOperations.length; i++) 
            this.getCreepsForOperation(this.initializedOperations[i], colony);

        for (var i = 0; i < this.startedOperations.length; i++) 
            this.getCreepsForOperation(this.startedOperations[i], colony);

        for (var i = 0; i < this.startedOperations.length; i++) 
            this.startedOperations[i].execute(colony);
    }

    public cleanup(colony: Colony) {
        for (var i = 0; i < this.newOperations.length; i++)
            this.newOperations[i].cleanup(colony);

        for (var i = 0; i < this.initializedOperations.length; i++)
            this.initializedOperations[i].cleanup(colony);

        for (var i = 0; i < this.startedOperations.length; i++)
            this.startedOperations[i].cleanup(colony);
        
        for (var i = 0; i < this.startedOperations.length; i++) {
            if (this.startedOperations[i].isFinished(colony)) {
                this.startedOperations[i].finish(colony);
                this.completedOperations.push(this.startedOperations[i].type);
                this.startedOperations.splice(i--, 1);
            }
        }        
    }

    public save(): OperationGroupMemory {
        var newOps = [];
        for (var i = 0; i < this.newOperations.length; i++) 
            newOps.push(this.newOperations[i].save());

        var initOps = [];
        for (var i = 0; i < this.initializedOperations.length; i++) 
            initOps.push(this.initializedOperations[i].save());

        var startedOps = [];
        for (var i = 0; i < this.startedOperations.length; i++) 
            startedOps.push(this.startedOperations[i].save());

        return {
            newOperations: newOps,
            initializedOperations: initOps,
            startedOperations: startedOps,
            completedOperations: this.completedOperations
        };
    }


     /** Spawns creeps required for an operation. */
    private getCreepsForOperation(op: Operation, colony: Colony) {
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
}
