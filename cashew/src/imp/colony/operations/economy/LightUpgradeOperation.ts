import { Colony } from "../../../../lib/colony/Colony";
import { Operation } from "../../../../lib/operation/Operation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";

export class LightUpgradeOperation extends Operation {
    public static fromMemory(memory: OperationMemory): LightUpgradeOperation {
        var op = new this();
        return Operation.fromMemory(op, memory);
    }

    constructor() {
        super("lightUpgrade");        
    }

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.assignedCreeps.length >= 1;
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

    protected onGetCreepRequirement(colony: Colony): SpawnDefinition[] {
        var def1 = new SpawnDefinition("lightUpgrader", "lightUpgrader", 250, 300);
        var def2 = new SpawnDefinition("lightUpgrader", "lightUpgrader", 250, 300);
        return [def1, def2];
    }

    protected onSave(): OperationMemory {
        return null;
    }
}
