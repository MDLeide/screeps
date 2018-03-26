import { Operation } from "./Operation";

export class OperationRepository {
    public static register(
        operationType: OperationType,
        loadOperationDelegate: (memory: OperationMemory) => Operation): void {        
        this.loadDelegates[operationType] = loadOperationDelegate;
    }

    public static load(memory: OperationMemory): Operation {
        if (!this.loadDelegates[memory.type])
            throw new Error(`${memory.type} has not been registered.`);
        return this.loadDelegates[memory.type](memory);
    }
    
    private static loadDelegates: { [operationType: string]: (memory: any) => Operation } = {};
}
