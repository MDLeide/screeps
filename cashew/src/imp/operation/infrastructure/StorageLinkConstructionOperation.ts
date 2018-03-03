import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class StorageLinkConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): StorageLinkConstructionOperation {
        let op = new this();
        return ConstructionOperation.fromMemory(memory, op) as StorageLinkConstructionOperation;
    }


    constructor() {
        super(OPERATION_STORAGE_LINK_CONSTRUCTION, 1);
    }
    

    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        throw Error("Storage link not implemented");
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_LINK;
    }

    protected onSave(): ConstructionOperationMemory {
        return null;
    }
}
