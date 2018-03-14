import { ScoutJob } from "../../creep/ScoutJob";
import { Job } from "../../../lib/creep/Job";
import { Colony } from "../../../lib/colony/Colony";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";

export class RoomScoutOperation extends JobOperation {
    public static fromMemory(memory: RoomScoutOperationMemory): RoomScoutOperation {
        let scout = new this(memory.targetRoomName);
        return Operation.fromMemory(memory, scout) as RoomScoutOperation;
    }


    constructor(targetRoomName: string) {
        super(OPERATION_ROOM_SCOUT, [new Assignment("", BodyRepository.scout(), CREEP_CONTROLLER_SCOUT)]);
        this.targetRoomName = targetRoomName;
    }


    public targetRoomName: string;
    public targetRoom: Room;

    
    protected onLoad(): void {
        if (this.targetRoomName)
            this.targetRoom = Game.getObjectById<Room>(this.targetRoomName);
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
        if (this.getFilledAssignmentCount() < 1)
            return false;
        let creep = Game.creeps[this.assignments[0].creepName];
        if (!creep)
            return false;

        return creep.room.name == this.targetRoomName
            && creep.pos.x > 0
            && creep.pos.x < 49
            && creep.pos.y > 0
            && creep.pos.y < 49;
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

    protected onCancel() {
    }

    
    protected onRelease(assignment: Assignment): void {
    }

    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected getJob(assignment: Assignment): Job {
        return new ScoutJob(this.targetRoomName);
    }


    protected onSave(): RoomScoutOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            targetRoomName: this.targetRoomName
        };
    }
}

export interface RoomScoutOperationMemory extends JobOperationMemory {
    targetRoomName: string;
}
