import { Colony } from "../../../../lib/colony/Colony";
import { ColonyOperation } from "../../../../lib/colony/ColonyOperation";
import { SpawnDefinition } from "../../../../lib/spawn/SpawnDefinition";

export class ExtensionsRcl2Operation extends ColonyOperation {
    constructor() {
        super("extensionsRcl2");
    }


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
        var locs = colony.nest.nestMap.extensionBlock.getExtensionLocations(2);

        for (var i = 0; i < locs.length; i++) {
            colony.nest.room.createConstructionSite(locs[i].x, locs[i].y, STRUCTURE_EXTENSION);
        }

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
        var def1 = new SpawnDefinition("builder", "builder", 250, 300);
        var def2 = new SpawnDefinition("builder", "builder", 250, 300);
        return [def1, def2];
    }
}
