import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { LightUpgraderRole } from "../../creep/LightUpgraderRole";

export class LightUpgradeOperation extends ControllerOperation {
    public static fromMemory(memory: ControllerOperationMemory): Operation {
        var op = new this();
        return ControllerOperation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_LIGHT_UPGRADE, LightUpgradeOperation.getAssignments());        
    }

    private static getAssignments(): Assignment[] {
        let assignments = [];
        for (var i = 0; i < 3; i++) {
            let a = new Assignment(undefined, BodyRepository.lightWorker());
            a.supportRequest = BodyRepository.lightWorker();
            a.supportRequest.minimumEnergy = 1500;
            a.maxSupportRange = 4;
            assignments.push(a);
        }
        return assignments;
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
        return false;
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
        

    protected getController(assignment: Assignment): LightUpgraderRole {
        return new LightUpgraderRole();
    }

    protected onSave(): ControllerOperationMemory {
        return null;
    }
}
