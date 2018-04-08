import { Colony } from "../../lib/colony/Colony";
import { Operation, StartStatus, InitStatus } from "../../lib/operation/Operation";
import { JobOperation } from "../../lib/operation/JobOperation";
import { Assignment } from "../../lib/operation/Assignment";
import { BodyRepository } from "../creep/BodyRepository";
import { BuilderJob } from "../creep/BuilderJob";

export abstract class ConstructionOperation extends JobOperation {
    public static fromMemory(memory: ConstructionOperationMemory, instance: ConstructionOperation): Operation {
        instance.siteIds = memory.siteIds;        
        return JobOperation.fromMemory(memory, instance);
    }

    constructor(type: OperationType, creeps: number | Assignment[]) {
        super(type, ConstructionOperation.getAssignments(creeps));
    }


    private static getAssignments(creeps: number | Assignment[]): Assignment[] {
        if (typeof (creeps) == "number") {
            let assignments = [];
            for (var i = 0; i < creeps; i++)
                assignments.push(new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_BUILDER));
            return assignments;
        } else {
            return creeps;
        }        
    }


    public siteIds: string[] = [];
    public sites: ConstructionSite[] = [];
    

    protected abstract getSiteLocations(colony: Colony): { x: number, y: number }[];
    protected abstract getStructureType(): BuildableStructureConstant;


    public isFinished(colony: Colony): boolean {
        return this.initializedStatus == InitStatus.Initialized && this.sites.length == 0;
    }


    protected getJob(assignment: Assignment): BuilderJob {
        if (this.siteIds.length)
            return new BuilderJob(this.siteIds[0]);
        return null;
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


    protected onInit(colony: Colony): InitStatus {
        let locations = this.getSiteLocations(colony);
        if (!locations || !locations.length) {
            this.message = "No construction site locations provided.";
            return InitStatus.Failed;
        }

        let type = this.getStructureType();

        this.siteIds = [];
        this.sites = [];

        if (this.initializedStatus == InitStatus.Partial) {
            let failedLocations = [];
            for (var i = 0; i < locations.length; i++) {
                let siteLook = colony.nest.room.lookForAt(LOOK_CONSTRUCTION_SITES, locations[i].x, locations[i].y);
                if (siteLook.length) {
                    this.siteIds.push(siteLook[0].id);
                    this.sites.push(siteLook[0]);
                } else {
                    failedLocations.push(locations[i]);
                }
            }
            if (failedLocations.length) {
                this.message = `Failed to find construction sites for ${failedLocations.length} location(s)`;
                for (var i = 0; i < failedLocations.length; i++) {
                    this.message += ` {${failedLocations[i].x},${failedLocations[i].y}}`;
                }
                return InitStatus.Failed;
            }           

            return InitStatus.Initialized;
        } else {
            for (var i = 0; i < locations.length; i++)
                colony.nest.room.createConstructionSite(locations[i].x, locations[i].y, type);            
            return InitStatus.Partial;
        }        
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() < 1)
            return StartStatus.TryAgain;
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(colony: Colony): void {
    }


    protected structureExists(room: Room, location: { x: number, y: number }, type: StructureConstant): boolean {
        let look = room.lookForAt(LOOK_STRUCTURES, location.x, location.y);
        for (var i = 0; i < look.length; i++)
            if (look[i].structureType == type)
                return true;
        return false;
    }


    public save(): ConstructionOperationMemory {
        let mem = super.save() as ConstructionOperationMemory;
        mem.siteIds = this.siteIds;
        return mem;
    }
}

export interface ConstructionOperationMemory extends JobOperationMemory {
    siteIds: string[];    
}
