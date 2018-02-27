import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";
import { UpgraderRole } from "../../creep/UpgraderRole";

export class HeavyUpgradeOperation extends ControllerOperation {
    public static fromMemory(memory: HeavyUpgradeOperationMemory): Operation {
        var op = new this();
        op.containerId = memory.containerId;
        op.controllerId = memory.controllerId;
        return ControllerOperation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_HEAVY_UPGRADE, HeavyUpgradeOperation.getAssignments());
    }

    private static getAssignments(): Assignment[] {
        var body = BodyRepository.heavyUpgrader();
        return [
            new Assignment("", body, CREEP_CONTROLLER_UPGRADER),
            new Assignment("", body, CREEP_CONTROLLER_UPGRADER)
        ]
    }

    public containerId: string;
    public controllerId: string;

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
        this.containerId = colony.getControllerEnergySource().id;
        this.controllerId = colony.nest.room.controller.id;
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
    
    protected getController(assignment: Assignment): UpgraderRole {
        return new UpgraderRole(this.containerId, this.controllerId);
    }

    protected onSave(): HeavyUpgradeOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            cancelMilestoneId: this.cancelMilestoneId,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            containerId: this.containerId,
            controllerId: this.controllerId
        };
    }
}

interface HeavyUpgradeOperationMemory extends ControllerOperationMemory {
    containerId: string;
    controllerId: string;
}
