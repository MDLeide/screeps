import { Colony } from "../colony/Colony"
import { Operation } from "./Operation"
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

        for (var i = 0; i < memory.completedOperationNames.length; i++) 
            group.completedOperationNames.push(memory.completedOperationNames[i]);

        return group;
    }

    constructor(operations: Operation[]) {
        this.newOperations = [];
        for (var i = 0; i < operations.length; i++) 
            this.newOperations.push(operations[i]);
        this.initializedOperations = [];
        this.startedOperations = [];
        this.completedOperationNames = [];
    }    

    
    public newOperations: Operation[];
    public initializedOperations: Operation[];
    public startedOperations: Operation[];
    public completedOperationNames: string[];

    public addOperation(operation: Operation): void {
        this.newOperations.push(operation);
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


        var toRemove: number[] = [];
        for (var i = 0; i < this.newOperations.length; i++) {
            var op = this.newOperations[i];
            if (op.canInit(colony)) {
                if (op.init(colony)) {
                    toRemove.push(i);
                    this.initializedOperations.push(op);
                }
            }
        }
        
        for (var i = toRemove.length - 1; i >= 0; i--) 
            this.newOperations.splice(toRemove[i], 1)

        toRemove = [];
        
        for (var i = 0; i < this.initializedOperations.length; i++) {
            var op = this.initializedOperations[i];
            if (op.canStart(colony)) {
                if (op.start(colony)) {
                    toRemove.push(i);
                    this.startedOperations.push(op);
                }
            }
        }

        for (var i = toRemove.length - 1; i >= 0; i--)
            this.initializedOperations.splice(toRemove[i], 1)
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.initializedOperations.length; i++) 
            this.spawnCreepsForOperation(this.initializedOperations[i], colony);

        for (var i = 0; i < this.startedOperations.length; i++) 
            this.spawnCreepsForOperation(this.startedOperations[i], colony);

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

        var toRemove: number[] = [];

        for (var i = 0; i < this.startedOperations.length; i++) {
            var op = this.startedOperations[i];

            if (op.isFinished(colony)) {
                op.finish(colony);
                this.completedOperationNames.push(op.name);
                toRemove.push(i);
            }
        }

        for (var i = toRemove.length - 1; i >= 0; i--)
            this.startedOperations.splice(toRemove[i], 1)
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
            completedOperationNames: this.completedOperationNames
        };
    }


     /** Spawns creeps required for an operation. */
    private spawnCreepsForOperation(op: Operation, colony: Colony) {
        var openAssignments = op.getUnfilledAssignments(colony);
        for (var i = 0; i < openAssignments.length; i++) {
            if (!colony.canSpawn(openAssignments[i].body))
                continue;
            var response = colony.spawnCreep(openAssignments[i].body);
            if (response)
                op.assignCreep({ name: response.name, bodyName: openAssignments[i].body.name });
        }
    }
}
