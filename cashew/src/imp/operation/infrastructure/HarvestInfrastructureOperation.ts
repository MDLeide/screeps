import { Colony } from "../../../lib/colony/Colony";
import { Operation, OperationStatus, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { MapBlock } from "../../../lib/map/base/MapBlock";
import { HarvestBlock } from "../../../lib/map/blocks/HarvestBlock";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { HarvestInfrastructureBuilderController } from "../../creep/HarvestInfrastructureBuilderController";

export class HarvestInfrastructureOperation extends ControllerOperation {   
    public static fromMemory(memory: HarvestInfrastructureOperationMemory): Operation {
        var op = new this(memory.sourceId);
        op.sourceId = memory.sourceId;
        op.siteId = memory.siteId;
        op.siteBuilt = memory.siteBuilt;
        return ControllerOperation.fromMemory(memory, op);
    }

    constructor(sourceId: string) {
        super(OPERATION_HARVEST_INFRASTRUCTURE, HarvestInfrastructureOperation.getAssignments());        
        this.sourceId = sourceId;
        this.source = Game.getObjectById<Source>(sourceId);
    }

    private static getAssignments(): Assignment[]{
        let assignments = [];
        for (var i = 0; i < 2; i++) {
            let a = new Assignment(undefined, BodyRepository.lightWorker(), CREEP_CONTROLLER_HARVEST_INFRASTRUCTURE_BUILDER);
            let supportBody = BodyRepository.lightWorker();
            supportBody.minimumEnergy = 1500;
            a.supportRequest = supportBody;
            assignments.push(a);
        }
        return assignments;
    }
    

    public source: Source;
    public sourceId: string;
    public site: ConstructionSite;
    public siteId: string;
    public siteBuilt: boolean;
    

    public isFinished(colony: Colony): boolean {
        return this.siteBuilt && this.initializedStatus == InitStatus.Initialized && (!this.site || this.site.progress >= this.site.progressTotal);
    }


    protected getController(assignment: Assignment): HarvestInfrastructureBuilderController {
        return new HarvestInfrastructureBuilderController(this.sourceId, this.siteId);
    }


    protected onLoad(): void {
        this.source = Game.getObjectById<Source>(this.sourceId);
        if (this.siteId) {
            this.site = Game.getObjectById<ConstructionSite>(this.siteId);
        }
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    protected onInit(colony: Colony): InitStatus {
        let harvestBlock: HarvestBlock;
        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            var block = colony.nest.nestMap.harvestBlocks[i];
            var s = block.getSourceLocation();
            if (this.source.pos.x == s.x && this.source.pos.y == s.y) {
                harvestBlock = block;
                break;
            }
        }
        let containerLocation = harvestBlock.getContainerLocation();

        let look = colony.nest.room.lookForAt(LOOK_STRUCTURES, containerLocation.x, containerLocation.y);
        for (var i = 0; i < look.length; i++) {
            if (look[i].structureType == STRUCTURE_CONTAINER) {
                this.siteBuilt = true;
                return InitStatus.Initialized;
            }
        }

        if (this.initializedStatus == InitStatus.Uninitialized || this.initializedStatus == InitStatus.TryAgain) {
            if (this.source.room.createConstructionSite(containerLocation.x, containerLocation.y, STRUCTURE_CONTAINER) == OK) {
                this.siteBuilt = true;
                return InitStatus.Partial;                
            }
            else
                return InitStatus.TryAgain;
        } else {
            let site = this.source.room.lookForAt(LOOK_CONSTRUCTION_SITES, containerLocation.x, containerLocation.y);
            if (site.length) {
                this.site = site[0];
                this.siteId = this.site.id;
                return InitStatus.Initialized;
            }
            return InitStatus.TryAgain;
        }
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() < 1)
            return StartStatus.TryAgain;
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        let harvestBlock: HarvestBlock;
        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            var block = colony.nest.nestMap.harvestBlocks[i];
            var s = block.getSourceLocation();

            if (this.source.pos.x == s.x && this.source.pos.y == s.y) {
                harvestBlock = block;
                break;
            }
        }
        let containerLocation = harvestBlock.getContainerLocation();

        var container = this.source.room.lookForAt<LOOK_STRUCTURES>(LOOK_STRUCTURES, containerLocation.x, containerLocation.y);
        for (var i = 0; i < container.length; i++) {
            if (container[i].structureType == STRUCTURE_CONTAINER) {
                colony.resourceManager.setSourceContainer(this.sourceId, container[i].id);
                return true;
            }
        }
        
        return false;
    }

    protected onCancel(): void {
    }


    public save(): HarvestInfrastructureOperationMemory {
        let mem = super.save() as HarvestInfrastructureOperationMemory;
        mem.sourceId = this.sourceId;
        mem.siteId = this.siteId;
        mem.siteBuilt = this.siteBuilt;
        return mem;
    }
}

export interface HarvestInfrastructureOperationMemory extends ControllerOperationMemory {
    sourceId: string;
    siteId: string;
    siteBuilt: boolean;
}
