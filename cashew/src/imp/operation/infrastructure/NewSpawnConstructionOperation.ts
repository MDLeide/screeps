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


    public isFinished(colony: Colony): boolean {
        return this.siteBuilt && this.siteId && (!this.site || this.site.progress >= this.site.progressTotal);
    }


    protected getJob(assignment: Assignment): Job {
        if (this.site)
            return new HarvestBuilderJob(this.siteId);
        else
            return new ScoutJob(this.roomName);
    }


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


    protected onInit(colony: Colony): InitStatus {
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() < 1)
            return StartStatus.TryAgain;
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        // transfer the remaining creeps to the new colony
        if (this.roomName) {
            let c = global.empire.getColonyByRoom(this.roomName);
            if (c) {
                for (var i = 0; i < this.assignments.length; i++) {
                    let name = this.assignments[i].creepName;
                    if (name)
                        global.empire.transferCreep(name, c);
                    name = this.assignments[i].replacementName;
                    if (name)
                        global.empire.transferCreep(name, c);
                }
            }
        }
        
        return true;
    }

    protected onCancel(): void {
    }


    public save(): NewSpawnConstructionOperationMemory {
        let mem = super.save() as NewSpawnConstructionOperationMemory;
        mem.roomName = this.roomName;
        mem.location = this.location;
        mem.siteBuilt = this.siteBuilt;
        mem.siteId = this.siteId;
        return mem;
    }
}

export interface NewSpawnConstructionOperationMemory extends JobOperationMemory {
    roomName: string;
    location: { x: number, y: number };
    siteBuilt: boolean;
    siteId: string;
}
