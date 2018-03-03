import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class ExtensionConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: ExtensionsOperationMemory): ExtensionConstructionOperation {
        let op = new this(memory.rcl);
        return ConstructionOperation.fromMemory(memory, op) as ExtensionConstructionOperation;
    }


    constructor(rcl: number) {
        super(OPERATION_EXTENSION_CONSTRUCTION, 2);
        this.rcl = rcl;
    }


    public rcl: number;


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return colony.nest.nestMap.extensionBlock.getExtensionLocations(this.rcl);
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_EXTENSION;
    }
    
    protected onSave(): ExtensionsOperationMemory {
        return {            
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            siteIds: this.siteIds,
            sitesBuilt: this.sitesBuilt,
            rcl: this.rcl
        };
    }
}

interface ExtensionsOperationMemory extends ConstructionOperationMemory {
    rcl: number;
}
