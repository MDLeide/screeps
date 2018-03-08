import { Operation } from "./Operation";
import { OperationRepository } from "./OperationRepository"

export class FlagOperation {

    constructor(flag: Flag) {

    }

    public operation: Operation;
    public flag: Flag;

    public save(): void {
        
    }
}


export class FlagOperationDiscovery {
    public findFlagOperations(): void {

    }
}
