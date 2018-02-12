import { Colony } from "../../../../lib/colony/Colony";
import { ColonyOperation } from "../../../../lib/colony/ColonyOperation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";

export class HarvestOperation extends ColonyOperation {
    constructor(minEnergy: number) {
        super("harvest");

        this.state.minEnergy = minEnergy;
    }

    public state: HarvestOperationMemory;

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.assigned.length >= 1;
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


    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onGetCreepRequirement(colony: Colony): SpawnDefinition[] {
        var def = new SpawnDefinition("heavyHarvester", "heavyHarvester", this.state.minEnergy, 0);
        return [def];
    }
}

interface HarvestOperationMemory extends ColonyOperationMemory {
    minEnergy: number;
}
