import { Colony } from "./Colony";
import { TypedMonitor } from "../monitor/Monitor";
import { Operation } from "../operation/Operation";

export abstract class ColonyMonitor extends TypedMonitor<Colony> {
    /**
     * Checks the running operations and ensures that at least count of the given type are running.
     * @param type Type of operation to ensure.
     * @param count Number of operations of this particular type that should be running.
     * @param create A delegate to create the operation.
     * @param predicate An optional delegate to check each operation with, operations will only be counted if this returns true.
     */
    protected ensureOperation(colony: Colony, type: OperationType, count: number, create: () => Operation, predicate?: (op: Operation) => boolean): void {
        let c = 0;
        for (var i = 0; i < colony.operations.runners.length; i++) {
            let op = colony.operations.runners[i].operation;
            if (op.type != type)
                continue;
            if (!predicate || predicate(op))
                c++;
        }
        
        while (c < count) {
            colony.operations.addOperation(create());
            c++;
        }            
    }
}
