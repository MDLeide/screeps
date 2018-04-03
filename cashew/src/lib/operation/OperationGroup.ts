import { Colony } from "../colony/Colony"
import { Operation, InitStatus, StartStatus, OperationStatus } from "./Operation"
import { Assignment } from "./Assignment"
import { OperationRepository } from "./OperationRepository";
import { OperationRunner } from "./OperationRunner";

export class OperationGroup {
    public static fromMemory(memory: OperationGroupMemory) {
        let ops: Operation[] = [];
        for (var i = 0; i < memory.operations.length; i++) 
            ops.push(OperationRepository.load(memory.operations[i]));

        return new this(ops);
    }


    constructor(operations: Operation[]) {
        for (var i = 0; i < operations.length; i++)
            this.runners.push(new OperationRunner(operations[i]));        
    }    


    public runners: OperationRunner[] = [];


    public load(): void {
        this.runners.forEach(p => p.load());
    }

    public update(colony: Colony): void {
        this.runners.forEach(p => p.update(colony));
    }

    public execute(colony: Colony): void {
        this.runners.forEach(p => p.execute(colony));
    }

    public cleanup(colony: Colony) {
        this.runners.forEach(p => p.cleanup(colony));
        for (var i = 0; i < this.runners.length; i++) {
            if (this.runners[i].operation.finished)
                this.runners.splice(i--, 1);
        }
    }
    
    public addOperation(operation: Operation): void {
        this.runners.push(new OperationRunner(operation));
    }
    
    public cancelOperationByType(colony: Colony, type: OperationType): void {
        for (var i = 0; i < this.runners.length; i++)
            if (this.runners[i].operation.type == type)
                this.runners[i].cancel(colony);
    }

    
    public save(): OperationGroupMemory {
        return {
            operations: this.runners.map(p => p.operation.save())
        };
    }
}
