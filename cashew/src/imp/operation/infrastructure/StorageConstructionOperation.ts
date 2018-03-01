import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";

export class StorageConstructionOperation extends JobOperation {
    public static fromMemory(memory: StorageConstructionMemory): Operation {
        var op = new this();
        op.siteBuilt = memory.siteBuilt;
        op.siteId = memory.siteId;
        return JobOperation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_STORAGE_CONSTRUCTION, StorageConstructionOperation.getAssignments());
    }

    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER),
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER)
        ];
    }


    public siteId: string;
    public site: ConstructionSite;
    public siteBuilt: boolean;

    
    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return this.initialized && this.siteBuilt && !this.site;
    }


    protected onInit(colony: Colony): boolean {
        let storage = colony.nest.nestMap.mainBlock.getStorageLocation();
        if (!this.siteBuilt) {            
            let result = colony.nest.room.createConstructionSite(storage.x, storage.y, STRUCTURE_STORAGE);
            this.siteBuilt = result == OK;
            return false;
        } else {
            let site = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, storage.x, storage.y);
            if (site.length) {
                this.site = site[0];
                this.siteId = this.site.id;
                return true;
            }
        }
        return false;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(): void {
    }


    protected onLoad(): void {
        if (this.siteId)
            this.site = Game.getObjectById<ConstructionSite>(this.siteId);
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    protected onRelease(assignment: Assignment): void {
    }

    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }


    protected getJob(assignment: Assignment): BuilderJob {
        return new BuilderJob(this.siteId);
    }

    protected onSave(): StorageConstructionMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            siteId: this.siteId,
            siteBuilt: this.siteBuilt
        };
    }
}

export interface StorageConstructionMemory extends JobOperationMemory {
    siteId: string;
    siteBuilt: boolean;
}
