import { OperationRunner } from "./OperationRunner";
import { Colony } from "../colony/Colony";
import { Operation } from "./Operation";
import { OperationRepository } from "./OperationRepository";


export abstract class Campaign {
    public static fromMemory(memory: CampaignMemory, instance: Campaign): Campaign {
        instance.type = memory.type;
        instance.operations = [];
        for (var i = 0; i < memory.operations.length; i++)
            instance.operations.push(new OperationRunner(OperationRepository.load(memory.operations[i])));
        return instance;
    }

    constructor(type: CampaignType) {
        this.type = type;
    }

    public type: CampaignType;
    public operations: OperationRunner[] = [];
    public get finished(): boolean {
        return this.operations.length == 0;
    }

    public load(): void {
        for (var i = 0; i < this.operations.length; i++)
            this.operations[i].load();        
    }

    public update(colony: Colony): void {
        for (var i = 0; i < this.operations.length; i++)
            this.operations[i].update(colony);
    }

    public execute(colony: Colony): void {
        for (var i = 0; i < this.operations.length; i++)
            this.operations[i].execute(colony);
    }

    public cleanup(colony: Colony): void {
        for (var i = 0; i < this.operations.length; i++) {
            this.operations[i].cleanup(colony);
            if (this.operations[i].operation.finished) {
                this.operationFinished(this.operations[i].operation, colony);
                this.operations.splice(i--, 1);
            }
        }
    }


    protected addOperation(operation: Operation): void {
        this.operations.push(new OperationRunner(operation));
    }


    protected abstract operationFinished(operation: Operation, colony: Colony): void;

    public save(): CampaignMemory {
        return {
            operations: this.operations.map(p => p.operation.save()),
            type: this.type
        };
    }
}

export class CampaignRepository {
    private static delegates: { [type: string]: (memory: CampaignMemory) => Campaign } = {};

    public static register(type: CampaignType, load: (memory: CampaignMemory) => Campaign) {
        this.delegates[type] = load;
    }

    public static load(memory: CampaignMemory) : Campaign{
        return this.delegates[memory.type](memory);
    }
}
