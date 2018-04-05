import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class StorageConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): Operation {
        var op = new this();
        return ConstructionOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_STORAGE_CONSTRUCTION, 1);
    }


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return [colony.nest.nestMap.mainBlock.getStorageLocation()];
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_STORAGE;
    }
}
