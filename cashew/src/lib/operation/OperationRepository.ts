import { Operation } from "./Operation";

export class OperationRepository {
    public static register(operationName: string, loadOperationDelegate: (memory: OperationMemory) => Operation): void {
        this.delegates[operationName] = loadOperationDelegate;
    }

    public static load(memory: OperationMemory): Operation {
        return this.delegates[memory.name](memory);
    }

    private static delegates: { [operationName: string]: (memory: any) => Operation } = {};
}
