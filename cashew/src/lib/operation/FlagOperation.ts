import { Operation } from "./Operation";
import { OperationRepository } from "./OperationRepository"
import { Colony } from "../colony/Colony";

export abstract class FlagOperation {
    constructor(flag: Flag, type: FlagOperationType) {
        this.hostFlag = flag;
        this.type = type;
    }

    public type: FlagOperationType;
    public hostFlag: Flag;

    public abstract getHostColony(): Colony;
    public abstract getOperation(): Operation;
}

export class FlagOperationDiscovery {
    public static findFlagOperations(): void {
        let names = Object.keys(Game.flags);
        for (var i = 0; i < names.length; i++) {
            let flag = Game.flags[names[i]];
            if (flag.memory.flagOperation)
                this.checkFlag(flag);            
        }
    }

    private static checkFlag(flag: Flag): void {
        if (!flag.memory.flagOperation)
            return;

        let flagOp = FlagOperationRepository.getNew(flag.memory.flagOperation.type, flag);
        let op = flagOp.getOperation();
        if (!op) {
            flag.remove();
            return;
        }

        let colony = flagOp.getHostColony();
        if (!colony) {
            flag.remove();
            return;
        }

        colony.operations.addOperation(op);
        flag.remove();
    }
}

export class FlagOperationRepository {
    private static delegates: { [type: string]: (flag: Flag) => FlagOperation } = {};

    public static register(type: FlagOperationType, createNew: (flag: Flag) => FlagOperation): void {
        this.delegates[type] = createNew;
    }

    public static getNew(type: FlagOperationType, flag: Flag): FlagOperation {
        return this.delegates[type](flag);
    }
}
