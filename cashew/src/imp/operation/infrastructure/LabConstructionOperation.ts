import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class LabConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: LabConstructionOperationMemory): LabConstructionOperation {
        let op = new this(memory.rcl);
        return ConstructionOperation.fromMemory(memory, op) as LabConstructionOperation;
    }


    constructor(rcl: number) {
        super(OPERATION_LAB_CONSTRUCTION, 1);
        this.rcl = rcl;
    }


    public rcl: number;


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return colony.nest.nestMap.labBlock.getLabLocations(this.rcl);
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_LAB;
    }

    protected onSave(): LabConstructionOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            siteIds: this.siteIds,
            rcl: this.rcl
        };
    }
}

interface LabConstructionOperationMemory extends ConstructionOperationMemory {
    rcl: number;
}
