import { Colony } from "../../../../lib/colony/Colony";
import { Operation } from "../../../../lib/operation/Operation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";

export class HarvestOperation extends Operation {

    public static fromMemory(memory: HarvestOperationMemory): HarvestOperation {
        var op = new this(memory.minimumEnergy);
        return Operation.fromMemory(op, memory);
    }

    constructor(minimumEnergyForSpawn: number) {
        super("harvest");
        this.minimumEnergy = minimumEnergyForSpawn;
    }

    public minimumEnergy: number;

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

    protected onSave(): HarvestOperationMemory {
        return {
            minimumEnergy: this.minimumEnergy,
            name: this.name,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignedCreeps: this.assignedCreeps
        };
    }

    protected onGetCreepRequirement(colony: Colony): SpawnDefinition[] {
        var def = new SpawnDefinition("heavyHarvester", "heavyHarvester", this.minimumEnergy, 0);
        return [def];
    }
}

interface HarvestOperationMemory extends OperationMemory {
    minimumEnergy: number;
}
