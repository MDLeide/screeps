import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";
import { HaulerRole } from "../../creep/HaulerRole";

export class EnergyTransportOperation extends ControllerOperation {
    public static fromMemory(memory: OperationMemory): Operation {
        var op = new this();
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_ENERGY_TRANSPORT, EnergyTransportOperation.getAssignments());        
    }

    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.hauler(), CREEP_CONTROLLER_HAULER),
            new Assignment("", BodyRepository.hauler(), CREEP_CONTROLLER_HAULER)
        ];
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

    
    protected onInit(colony: Colony): boolean {
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected getController(assignment: Assignment): HaulerRole {
        return new HaulerRole();
    }
}
