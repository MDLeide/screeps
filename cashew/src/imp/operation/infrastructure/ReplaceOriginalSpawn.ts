import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class SpawnConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: SpawnConstructionOperationMemory): SpawnConstructionOperation {
        let op = new this(memory.rcl);
        return ConstructionOperation.fromMemory(memory, op) as SpawnConstructionOperation;
    }


    constructor(rcl: number) {
        super(OPERATION_SPAWN_CONSTRUCTION, 1);
        this.rcl = rcl;
    }
    

    public rcl: number;

    public canInit(colony: Colony): boolean {
        if (this.rcl < 7) {
            this.finish(colony);
            return false;
        }
        return super.canInit(colony);
    }

    public onInit(colony: Colony): boolean {

    }


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return [colony.nest.nestMap.mainBlock.getSpawnLocation(this.rcl)];
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_SPAWN;
    }

    protected onSave(): SpawnConstructionOperationMemory {
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
        }
    }
}

export interface SpawnConstructionOperationMemory extends ConstructionOperationMemory {
    rcl: number;
}
