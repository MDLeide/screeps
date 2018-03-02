import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { UpgraderController } from "../../creep/UpgraderController";

export class HeavyUpgradeOperation extends ControllerOperation {
    public static fromMemory(memory: ControllerOperationMemory): Operation {
        var op = new this();
        return ControllerOperation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_HEAVY_UPGRADE, []);
    }


    public colony: Colony;


    protected onLoad(): void {
        
    }

    protected onUpdate(colony: Colony): void {
        this.colony = colony;
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
        let distance = colony.nest.room.controller.pos.findPathTo(colony.nest.spawners[0].spawn).length;
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

    
    protected getController(assignment: Assignment): UpgraderController {
        return new UpgraderController(
            this.colony.resourceManager.controllerContainerId,
            this.colony.nest.room.controller.id,
            this.colony.resourceManager.controllerLinkId);
    }    
}

