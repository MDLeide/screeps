import { Colony } from "../../../lib/colony/Colony";
import { Operation, StartStatus, InitStatus } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { ScoutJob } from "../../creep/ScoutJob";
import { HarvestBuilderJob } from "../../creep/HarvestBuilderJob";
import { Job } from "../../../lib/creep/Job";

export class NewSpawnConstructionOperation extends JobOperation {
    public static fromMemory(memory: NewSpawnConstructionOperationMemory): Operation {
        var op = new this(memory.roomName, memory.location);
        op.siteId = memory.siteId;
        op.siteBuilt = memory.siteBuilt;
        return JobOperation.fromMemory(memory, op);
    }

    constructor(roomName: string, location: { x: number, y: number }) {
        super(
            OPERATION_NEW_SPAWN_CONSTRUCTION,
            [
                new Assignment(undefined, BodyRepository.lightWorker()),
                new Assignment(undefined, BodyRepository.lightWorker()),
                new Assignment(undefined, BodyRepository.lightWorker())
            ]
        );

        this.roomName = roomName;
        this.location = location;
    }


    public roomName: string;
    public room: Room;
    public location: { x: number, y: number };
    public siteBuilt: boolean;
    public siteId: string;
    public site: ConstructionSite;


    protected onLoad(): void {
        if (this.roomName)
            this.room = Game.rooms[this.roomName];
        if (this.siteId)
            this.site = Game.getObjectById<ConstructionSite>(this.siteId);
    }


    protected onUpdate(colony: Colony): void {
        if (!this.siteBuilt && this.room) {
            this.room.createConstructionSite(this.location.x, this.location.y, STRUCTURE_SPAWN);
            this.siteBuilt = true;
        } else if (this.room && this.siteBuilt && !this.siteId) {
            let look = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.location.x, this.location.y);
            if (look.length) {
                this.site = look[0];
                this.siteId = this.site.id;
            }
        }
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
        return this.siteBuilt && this.siteId && (!this.site || this.site.progress >= this.site.progressTotal);
    }


    protected onInit(colony: Colony): InitStatus {
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        return StartStatus.Started;
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


    protected getJob(assignment: Assignment): Job {
        if (this.site)
            return new HarvestBuilderJob(this.siteId);
        else
            return new ScoutJob(this.roomName);
    }

    protected onSave(): NewSpawnConstructionOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            roomName: this.roomName,
            location: this.location,
            siteBuilt: this.siteBuilt,
            siteId: this.siteId
        }
    }
}

export interface NewSpawnConstructionOperationMemory extends JobOperationMemory {
    roomName: string;
    location: { x: number, y: number };
    siteBuilt: boolean;
    siteId: string;
}
