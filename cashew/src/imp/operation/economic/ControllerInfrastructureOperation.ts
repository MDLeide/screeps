import { Colony } from "../../../lib/colony/Colony";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";
import { Job } from "../../../lib/creep/Job";
import { Operation } from "../../../lib/operation/Operation";

export class ControllerInfrastructureOperation extends JobOperation {
    public static fromMemory(memory: ControllerInfrastructureOperationMemory): Operation {
        var op = new this();
        op.siteId = memory.siteId;
        op.siteBuilt = memory.siteBuilt;
        return JobOperation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_CONTROLLER_INFRASTRUCTURE, ControllerInfrastructureOperation.getAssignments());        
    }

    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.lightWorker(), CONTROLLER_BUILD),
            new Assignment("", BodyRepository.lightWorker(), CONTROLLER_BUILD)
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
        return this.siteBuilt && this.initialized && (!this.site || this.site.progress >= this.site.progressTotal);
    }
    
    protected onInit(colony: Colony): boolean {
        let containerLocation = colony.nest.nestMap.controllerBlock.getContainerLocation();

        if (!this.siteBuilt) {            
            let result = colony.nest.room.createConstructionSite(containerLocation.x, containerLocation.y, STRUCTURE_CONTAINER);
            this.siteBuilt = result == OK;
            return false;
        } else {
            let site = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, containerLocation.x, containerLocation.y);
            if (site.length) {
                this.siteId = site[0].id;
                this.site = site[0];
                return true;
            }
            return false;
        }
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        var containerLocation = colony.nest.nestMap.controllerBlock.getContainerLocation();
        var look = colony.nest.room.lookForAt(LOOK_STRUCTURES, containerLocation.x, containerLocation.y);
        for (var i = 0; i < look.length; i++) {
            if (look[i].structureType == STRUCTURE_CONTAINER) {
                (look[i] as StructureContainer).nut.tag = "controller";
                return true;
            }
        }
        return false;
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

    protected onAssignment(assignment: Assignment): void {
    }

    protected getJob(assignment: Assignment): Job {
        return null;
    }
    
    protected onSave(): ControllerInfrastructureOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            siteId: this.siteId,
            siteBuilt: this.siteBuilt
        };
    }
}

export interface ControllerInfrastructureOperationMemory extends JobOperationMemory {
    siteId: string;    
    siteBuilt: boolean;
}
