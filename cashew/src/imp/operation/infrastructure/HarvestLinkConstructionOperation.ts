import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";

export class HarvestLinkConstructionOperation extends JobOperation {
    public static fromMemory(memory: HarvestLinkConstructionOperationMemory): Operation {
        var op = new this(memory.sourceId);
        op.siteBuilt = memory.siteBuilt;
        op.siteId = memory.siteId;
        return JobOperation.fromMemory(memory, op);
    }


    constructor(sourceId: string) {
        super(OPERATION_HARVEST_LINK_CONSTRUCTION, HarvestLinkConstructionOperation.getAssignments());
        this.sourceId = sourceId;
    }


    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER)
        ];
    }


    public sourceId: string;
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
        let linkLocation: { x: number, y: number };

        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            let sourceLocation = colony.nest.nestMap.harvestBlocks[i].getSourceLocation();
            let sourceLook = colony.nest.room.lookForAt(LOOK_SOURCES, sourceLocation.x, sourceLocation.y);
            if (sourceLook.length) {
                if (sourceLook[0].id == this.sourceId) {
                    linkLocation = colony.nest.nestMap.harvestBlocks[i].getLinkLocation();
                    break;
                }
            }
        }
        
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
        let linkLocation: { x: number, y: number };

        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            let sourceLocation = colony.nest.nestMap.harvestBlocks[i].getSourceLocation();
            let sourceLook = colony.nest.room.lookForAt(LOOK_SOURCES, sourceLocation.x, sourceLocation.y);
            if (sourceLook.length) {
                if (sourceLook[0].id == this.sourceId) {
                    linkLocation = colony.nest.nestMap.harvestBlocks[i].getLinkLocation();
                    break;
                }
            }
        }
                
        let linkLook = colony.nest.room.lookForAt(LOOK_STRUCTURES, linkLocation.x, linkLocation.y);
        if (linkLook.length) {
            if (linkLook[0].structureType == STRUCTURE_LINK) {
                colony.resourceManager.updateSourceContainerOrLink(this.sourceId, linkLook[0].id);
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


    protected onSave(): HarvestLinkConstructionOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            sourceId: this.sourceId,
            siteBuilt: this.siteBuilt,
            siteId: this.siteId
        };
    }
}

interface HarvestLinkConstructionOperationMemory extends JobOperationMemory {
    sourceId: string;
    siteBuilt: boolean;
    siteId: string;
}
