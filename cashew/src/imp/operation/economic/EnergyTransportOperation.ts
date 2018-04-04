import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { HaulerRole } from "../../creep/HaulerRole";

export class EnergyTransportOperation extends ControllerOperation {
    public static fromMemory(memory: ControllerOperationMemory): Operation {
        var op = new this();
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_ENERGY_TRANSPORT, EnergyTransportOperation.getAssignments());
        this.priority = 8;
    }


    private static getAssignments(): Assignment[] {
        let body = BodyRepository.hauler();
        return [
            
            new Assignment("", body, CREEP_CONTROLLER_HAULER, 75),
            new Assignment("", body, CREEP_CONTROLLER_HAULER, 75)
        ];
    }


    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        let energy = 300;
        for (var i = 0; i < this.assignments.length; i++) {
            this.assignments[i].body.minimumEnergy = energy;
            this.assignments[i].body.waitForFullEnergy = false;
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
        return true;
    }

    protected onCancel(colony: Colony): void {
    }
    
    protected getController(assignment: Assignment): HaulerRole {
        return new HaulerRole();
    }
}
