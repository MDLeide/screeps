import { JobOperation } from "lib/operation/JobOperation";
import { ClaimJob } from "../../creep/ClaimJob";
import { Job } from "lib/creep/Job";
import { Assignment } from "lib/operation/Assignment";
import { Colony } from "lib/colony/Colony";
import { InitStatus, StartStatus } from "lib/operation/Operation";
import { BodyRepository } from "../../creep/BodyRepository";

export class ClaimRoomOperation extends JobOperation {
    public static fromMemory(memory: ClaimRoomOperationMemory): ClaimRoomOperation {
        let op = new this(memory.roomName);
        return JobOperation.fromMemory(memory, op) as ClaimRoomOperation;
    }


    constructor(roomName: string) {
        super(OPERATION_CLAIM_ROOM, []);
        let body = BodyRepository.claimer();
        body.maxCompleteScalingSections = 1;
        this.assignments.push(new Assignment(undefined, body));
        this.roomName = roomName;
    }


    public roomName: string;


    public isFinished(colony: Colony): boolean {
        let room = Game.rooms[this.roomName];
        return room && room.controller && room.controller.my;
    }


    protected getJob(assignment: Assignment): Job {
        return new ClaimJob(this.roomName);
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
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
        return true;
    }

    protected onCancel(): void {        
    }


    public save(): ClaimRoomOperationMemory {
        let mem = super.save() as ClaimRoomOperationMemory;
        mem.roomName = this.roomName;
        return mem;
    }
}

export interface ClaimRoomOperationMemory extends JobOperationMemory {
    roomName: string;
}
