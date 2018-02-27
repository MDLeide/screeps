import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";

export class TowerConstructionOperation extends JobOperation {
    public static fromMemory(memory: TowerConstructionOperationMemory): Operation {
        var op = new this(memory.rcl);
        op.siteBuilt = memory.siteBuilt;
        op.siteId = memory.siteId;
        return JobOperation.fromMemory(memory, op);
    }

    constructor(rcl: number) {
        super(OPERATION_TOWER_CONSTRUCTION, TowerConstructionOperation.getAssignments());
        this.rcl = rcl;
    }

    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER),
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER)
        ];
    }


    public rcl: number;
    public siteBuilt: boolean;
    public siteId: string;
    public site: ConstructionSite;


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
        let tower = colony.nest.nestMap.mainBlock.getTowerLocation(this.rcl);
        if (!this.siteBuilt) {            
            colony.nest.room.createConstructionSite(tower.x, tower.y, STRUCTURE_TOWER);
            this.siteBuilt = true;
            return false;
        } else {
            let site = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, tower.x, tower.y);
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
    
    protected getJob(assignment: Assignment): BuilderJob {
        return new BuilderJob(this.siteId);
    }

    protected onSave(): TowerConstructionOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            rcl: this.rcl,
            siteBuilt: this.siteBuilt,
            siteId: this.siteId
        };
    }
}

interface TowerConstructionOperationMemory extends JobOperationMemory {
    rcl: number;
    siteBuilt: boolean;
    siteId: string;
}
