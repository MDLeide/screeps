import { Operation } from "./Operation";

export class OperationRepository {
    public static register(
        operationType: OperationType,
        loadOperationDelegate: (memory: OperationMemory) => Operation,
        newOperationDelegate: (flag?: Flag) => Operation): void {        
        this.loadDelegates[operationType] = loadOperationDelegate;
        this.newDelegates[operationType] = newOperationDelegate;
    }

    public static load(memory: OperationMemory): Operation {
        if (!this.loadDelegates[memory.type])
            throw new Error(`${memory.type} has not been registered.`);
        return this.loadDelegates[memory.type](memory);
    }

    public static getNew(type: OperationType, flag?: Flag): Operation {
        if (!this.newDelegates[type])
            throw new Error(`${type} has not been registered.`);
        return this.newDelegates[type](flag);
    }

    private static newDelegates: { [operationType: string]: (flag?: Flag) => Operation } = {};
    private static loadDelegates: { [operationType: string]: (memory: any) => Operation } = {};
}
