import { Operation } from "./Operation";

export class OperationRepository {
    public static register(operationType: OperationType, loadOperationDelegate: (memory: OperationMemory) => Operation): void {
        this.delegates[operationType] = loadOperationDelegate;
    }

    public static load(memory: OperationMemory): Operation {
        return this.delegates[memory.type](memory);
    }

    private static delegates: { [operationType: string]: (memory: any) => Operation } = {};
}
