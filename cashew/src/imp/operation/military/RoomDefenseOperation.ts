import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
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


    private checkAssignments(colony: Colony): void {
        if (colony.watchtower.threatScore > 1000 && this.assignments.length < 3)
            this.assignments.push(new Assignment("", BodyRepository.defender(), CREEP_CONTROLLER_DEFENDER, 200));

        if (colony.watchtower.threatScore > 3000 && this.assignments.length < 4)
            this.assignments.push(new Assignment("", BodyRepository.defender(), CREEP_CONTROLLER_DEFENDER, 200));

        if (colony.watchtower.threatScore > 5000 && this.assignments.length < 5)
            this.assignments.push(new Assignment("", BodyRepository.defender(), CREEP_CONTROLLER_DEFENDER, 200));
    }


    protected onLoad(): void {
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
        return colony.watchtower.threatScore == 0;
    }


    protected onInit(colony: Colony): boolean {
        this.assignments.push(new Assignment("", BodyRepository.defender(), CREEP_CONTROLLER_DEFENDER, 200));
        this.assignments.push(new Assignment("", BodyRepository.defender(), CREEP_CONTROLLER_DEFENDER, 200));
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(): void {
    }


    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }


    protected getController(assignment: Assignment): CreepController {
        return new DefenderController();
    }    
}
