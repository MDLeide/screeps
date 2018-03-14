import { Colony } from "../../../lib/colony/Colony";
import { Operation, StartStatus, InitStatus } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { ScoutJob } from "../../creep/ScoutJob";
import { ReserveJob } from "../../creep/ReserveJob";
import { Job } from "../../../lib/creep/Job";

export class ReservationOperation extends JobOperation {
    public static fromMemory(memory: ReservationOperationMemory): Operation {
        var op = new this(memory.roomName);
        op.distance = memory.distance;
        op.targetReservation = memory.targetReservation;
        return JobOperation.fromMemory(memory, op);
    }

    constructor(roomName: string) {
        super(OPERATION_RESERVATION, []);
        this.roomName = roomName;
    }


    public roomName: string;
    public room: Room;
    public distance: number;
    public targetReservation: number;


    protected onLoad(): void {
        if (this.roomName)
            this.room = Game.rooms[this.roomName];        
    }

    protected onUpdate(colony: Colony): void {
        if (!this.distance && this.room)
            this.updateDistance(colony);

        if (this.distance && (!this.targetReservation || Game.time % 500 == 350))
            this.updateReservationAndParts(colony);

        let assignment = this.assignments[0];
        if (!assignment)
            return;
        if (!this.room) {
            assignment.onHold = false;
        } else {
            let reservation = this.room.controller.reservation;
            if (!reservation || reservation.ticksToEnd <= this.targetReservation)
                assignment.onHold = false;
            else
                assignment.onHold = true;
        }
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    private updateReservationAndParts(colony: Colony): void {
        let timeOn = CREEP_CLAIM_LIFE_TIME - this.distance;
        let reservationFloor = 750; // minimum reservation time
        let buffer = 250; // so we ensure claim parts work full time, we dont want to get to 5k
        let neededParts = Math.ceil((CONTROLLER_RESERVE_MAX - reservationFloor - buffer) / (timeOn * CONTROLLER_RESERVE));
        let maxParts = Math.floor(colony.nest.room.energyCapacityAvailable / (BODYPART_COST[CLAIM] + BODYPART_COST[MOVE]));

        if (neededParts > maxParts) {
            reservationFloor = CONTROLLER_RESERVE_MAX - maxParts * timeOn - buffer;
            neededParts = maxParts;
        }

        let assignment = this.assignments[0];
        if (assignment) {
            assignment.body.maxCompleteScalingSections = neededParts - 1;
            if (neededParts == 1)
                assignment.replaceAt = this.distance + 6 + 10;
            else
                assignment.replaceAt = 0;            
        }
        
        this.targetReservation = reservationFloor;
    }

    private updateDistance(colony: Colony): void {
        let spawn = colony.nest.spawners[0].spawn;
        let controller = this.room.controller;
        let path = PathFinder.search(spawn.pos, { pos: controller.pos, range: 1 });
        this.distance = path.cost;
    }
    

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected onInit(colony: Colony): InitStatus {
        this.assignments.push(new Assignment("", BodyRepository.claimer()));

        if (this.room) {
            this.updateDistance(colony);
            this.updateReservationAndParts(colony);
        }

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
        return new ReserveJob(this.roomName);        
    }

    protected onSave(): ReservationOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            jobs: this.getJobMemory(),
            roomName: this.roomName,
            distance: this.distance,
            targetReservation: this.targetReservation
        }
    }
}

export interface ReservationOperationMemory extends JobOperationMemory {
    roomName: string;
    distance: number;
    targetReservation: number;
}
