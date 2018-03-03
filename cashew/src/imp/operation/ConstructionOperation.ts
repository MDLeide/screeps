import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";
import { JobOperation } from "../../lib/operation/JobOperation";
import { Assignment } from "../../lib/operation/Assignment";
import { BodyRepository } from "../creep/BodyRepository";
import { BuilderJob } from "../creep/BuilderJob";

export abstract class ConstructionOperation extends JobOperation {
    public static fromMemory(memory: ConstructionOperationMemory, instance: ConstructionOperation): Operation {
        instance.siteIds = memory.siteIds;
        instance.sitesBuilt = memory.sitesBuilt;
        return JobOperation.fromMemory(memory, instance);
    }

    constructor(type: OperationType, creepCount: number) {
        super(type, ConstructionOperation.getAssignments(creepCount));
    }


    private static getAssignments(count: number): Assignment[] {
        let assignments = [];
        for (var i = 0; i < count; i++) 
            assignments.push(new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER));
        return assignments;
    }


    public siteIds: string[];
    public sites: ConstructionSite[] = [];
    public sitesBuilt: boolean;


    protected abstract getSiteLocations(colony: Colony): { x: number, y: number }[];
    protected abstract getStructureType(): BuildableStructureConstant;


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


    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return this.initialized && this.sitesBuilt && this.sites.length == 0;
    }


    protected onInit(colony: Colony): boolean {
        let locations = this.getSiteLocations(colony);
        let type = this.getStructureType();

        this.siteIds = [];
        this.sites = [];

        if (this.sitesBuilt) {
            for (var i = 0; i < locations.length; i++) {
                let siteLook = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, locations[i].x, locations[i].y);
                if (siteLook.length) {
                    this.siteIds.push(siteLook[0].id);
                    this.sites.push(siteLook[0]);
                }
            }
            return true;
        } else {
            for (var i = 0; i < locations.length; i++)
                colony.nest.room.createConstructionSite(locations[i].x, locations[i].y, type);
            this.sitesBuilt = true;
            return false;
        }        
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
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
        if (this.siteIds.length)
            return new BuilderJob(this.siteIds[0]);
        return null;
    }


    protected onSave(): ConstructionOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            siteIds: this.siteIds,
            sitesBuilt: this.sitesBuilt
        };
    }
}

export interface ConstructionOperationMemory extends JobOperationMemory {
    siteIds: string[];
    sitesBuilt: boolean;
}
