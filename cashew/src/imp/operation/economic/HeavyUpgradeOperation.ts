import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { UpgraderRole } from "../../creep/UpgraderRole";

export class HeavyUpgradeOperation extends ControllerOperation {
    public static fromMemory(memory: HeavyUpgradeOperationMemory): Operation {
        var op = new this();
        op.containerId = memory.containerId;
        op.controllerId = memory.controllerId;
        return ControllerOperation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_HEAVY_UPGRADE, []);
    }
    

    public containerId: string;
    public controllerId: string;
    

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


    protected onInit(colony: Colony): boolean {
        this.containerId = colony.getControllerEnergySource().id;
        this.controllerId = colony.nest.room.controller.id;

        let distance = colony.getControllerEnergySource().pos.findPathTo(colony.nest.spawners[0].spawn).length;
        let body = BodyRepository.heavyUpgrader();
        body.maxCompleteScalingSections = 20;
        let parts = body.getBody(colony.nest.room.energyCapacityAvailable);
        let spawnTime = parts.length * 3;
        let transitTime = distance * parts.length;
        let buffer = 35;

        let assignment = new Assignment("", body, CREEP_CONTROLLER_UPGRADER, spawnTime + transitTime + buffer);
        this.assignments.push(assignment);

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


    protected getController(assignment: Assignment): UpgraderRole {
        return new UpgraderRole(this.containerId, this.controllerId);
    }


    protected onSave(): HeavyUpgradeOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,            
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
