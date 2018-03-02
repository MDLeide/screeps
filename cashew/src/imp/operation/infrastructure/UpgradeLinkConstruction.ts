import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";

export class UpgradeLinkConstructionOperation extends JobOperation {
    public static fromMemory(memory: UpgradeLinkConstructionOperationMemory): Operation {
        var op = new this();
        op.siteBuilt = memory.siteBuilt;
        op.siteId = memory.siteId;
        return JobOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_UPGRADE_LINK_CONSTRUCTION, UpgradeLinkConstructionOperation.getAssignments());
    }


    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER)
        ];
    }

        
    public siteBuilt: boolean;
    public siteId: string;
    public site: ConstructionSite;


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
        let linkLocation = colony.nest.nestMap.controllerBlock.getLinkLocation();
                
        if (!this.siteBuilt) {            
            colony.nest.room.createConstructionSite(linkLocation.x, linkLocation.y, STRUCTURE_LINK);
            this.siteBuilt = true;
            return false;
        } else {
            let site = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, linkLocation.x, linkLocation.y);
            if (site.length) {
                this.site = site[0];
                this.siteId = this.site.id;
                return true;
            }
            this.siteBuilt = false;
        }
        return false;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        let linkLocation = colony.nest.nestMap.controllerBlock.getLinkLocation();               
        let linkLook = colony.nest.room.lookForAt(LOOK_STRUCTURES, linkLocation.x, linkLocation.y);
        if (linkLook.length) {
            if (linkLook[0].structureType == STRUCTURE_LINK) {
                colony.resourceManager.controllerLink = linkLook[0] as StructureLink;
                colony.resourceManager.controllerLinkId = linkLook[0].id;
            }
        }
        return true;
    }

    protected onCancel(): void {
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


    protected onSave(): UpgradeLinkConstructionOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),            
            siteBuilt: this.siteBuilt,
            siteId: this.siteId
        };
    }
}

interface UpgradeLinkConstructionOperationMemory extends JobOperationMemory {
    siteBuilt: boolean;
    siteId: string;
}
