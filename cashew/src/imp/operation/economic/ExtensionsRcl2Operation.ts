import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class ExtensionsRcl2Operation extends Operation {
    public static fromMemory(memory: OperationMemory): Operation {
        var op = new this();
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super("extensionsRcl2", ExtensionsRcl2Operation.getAssignments());
    }

    private static getAssignments(): Assignment[]{
        return [
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder"),
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder")
        ];
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
