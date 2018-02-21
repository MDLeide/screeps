import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class StorageConstructionOperation extends Operation {
    public static fromMemory(memory: OperationMemory): Operation {
        var op = new this();
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super("storageConstruction", StorageConstructionOperation.getAssignments());
    }

    private static getAssignments(): Assignment[] {
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
        var storage = colony.nest.nestMap.mainBlock.getStorageLocation();
        var look = colony.nest.room.lookForAt(LOOK_STRUCTURES, storage.x, storage.y);
        for (var i = 0; i < look.length; i++) 
            if (look[i].structureType == STRUCTURE_STORAGE)
                return true;        
        return false;
    }

    
    protected onInit(colony: Colony): boolean {
        var storage = colony.nest.nestMap.mainBlock.getStorageLocation();
        var result = colony.nest.room.createConstructionSite(storage.x, storage.y, STRUCTURE_STORAGE);
        return result == OK;
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
