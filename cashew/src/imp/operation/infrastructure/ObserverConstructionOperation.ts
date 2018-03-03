import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class ObserverConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): ObserverConstructionOperation {
        let op = new this();
        return ConstructionOperation.fromMemory(memory, op) as ObserverConstructionOperation;
    }


    constructor() {
        super(OPERATION_OBSERVER_CONSTRUCTION, 1);
    }
    

    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        throw Error("observer not implemented");
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_OBSERVER;
    }

    protected onSave(): ConstructionOperationMemory {
        return null;
    }
}
