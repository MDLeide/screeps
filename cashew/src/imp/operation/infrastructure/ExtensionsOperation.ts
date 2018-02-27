import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../spawn/BodyRepository";

export class ExtensionConstruction extends JobOperation {
    public static fromMemory(memory: ExtensionsOperationMemory): Operation {
        var op = new this(memory.rcl);
        op.siteIds = memory.siteIds;
        op.sitesBuilt = memory.sitesBuilt;
        return JobOperation.fromMemory(memory, op);
    }

    constructor(rcl: number) {
        super(OPERATION_EXTENSION_CONSTRUCTION, ExtensionConstruction.getAssignments());
        this.rcl = rcl;
    }


    public rcl: number;
    public siteIds: string[] = [];
    public sites: ConstructionSite[] = [];
    public sitesBuilt: boolean;

    private static getAssignments(): Assignment[]{
        return [
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER),
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER)
        ];
    }

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return this.sitesBuilt && this.initialized && this.sites.length == 0;
    }


    protected onInit(colony: Colony): boolean {
        let locs = colony.nest.nestMap.extensionBlock.getExtensionLocations(this.rcl);
        if (!this.sitesBuilt) {            
            for (let i = 0; i < locs.length; i++) {
                colony.nest.room.createConstructionSite(locs[i].x, locs[i].y, STRUCTURE_EXTENSION);
            }
            this.sitesBuilt = true;
            return false;
        } else {
            for (let i = 0; i < locs.length; i++) {
                let site = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, locs[i].x, locs[i].y);
                if (site.length) {
                    this.siteIds.push(site[0].id);
                    this.sites.push(site[0]);
                }
            }
            if (this.siteIds.length > 0)
                return true;
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
        this.sites = [];
        for (var i = 0; i < this.siteIds.length; i++) {
            let site = Game.getObjectById<ConstructionSite>(this.siteIds[i]);
            if (site)
                this.sites.push(site);
            else
                this.siteIds.splice(i--, 1);
        }
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }
    
    protected getJob(assignment: Assignment): BuilderJob {
        if (this.siteIds.length)
            return new BuilderJob(this.siteIds[0]);
        return null;
    }

    protected onSave(): ExtensionsOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            rcl: this.rcl,
            siteIds: this.siteIds,
            sitesBuilt: this.sitesBuilt
        };
    }
}

interface ExtensionsOperationMemory extends JobOperationMemory {
    rcl: number;
    siteIds: string[];
    sitesBuilt: boolean;
}
