import { Colony } from "../../../lib/colony/Colony";
import { Operation, StartStatus, InitStatus  } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { DefenderController } from "../../creep/DefenderController";

export class RoomDefenseOperation extends ControllerOperation {
    public static fromMemory(memory: ControllerOperationMemory): Operation {
        let op = new this();
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_ROOM_DEFENSE, []);
    }


    public isFinished(colony: Colony): boolean {
        return colony.watchtower.threatScore == 0;
    }


    protected getController(assignment: Assignment): CreepController {
        return new DefenderController();
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
}
