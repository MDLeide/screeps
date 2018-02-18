import { Colony } from "../../../../lib/colony/Colony";
import { Operation } from "../../../../lib/operation/Operation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";

export class OperationTemplate extends Operation {
    constructor() {
        super("opName");        
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
        var def = new SpawnDefinition("lightMiner", "lightMiner", 250, 300);
        return [def];
    }

    protected onSave(): OperationMemory {
        return null;
    }
}
