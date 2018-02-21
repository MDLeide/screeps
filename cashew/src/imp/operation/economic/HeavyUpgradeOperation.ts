import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class HeavyUpgradeOperation extends Operation {

    public static fromMemory(memory: OperationMemory): Operation {
        var op = new this();
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super("heavyUpgrade", HeavyUpgradeOperation.getAssignments());
    }

    private static getAssignments(): Assignment[] {
        var body = BodyRepository.heavyUpgrader();
        return [
            new Assignment("", body, "heavyUpgrader"),
            new Assignment("", body, "heavyUpgrader")
        ]
    }
    

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return false;
    }
    

    protected onInit(colony: Colony): boolean {
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onSave(): OperationMemory {
        return null;
    }
}

interface HarvestOperationMemory extends OperationMemory {
    minimumEnergy: number;
}
