import { Operation } from "./Operation";

export class OperationRepository {
    public static register(operationName: string, loadOperationDelegate: (memory: any) => Operation): void {
        this.delegates[operationName] = loadOperationDelegate;
    }

    public static load(memory: any): Operation {
        return this.delegates[memory.name](memory);
    }

    private static delegates: { [operationName: string]: (memory: any) => Operation };
}
