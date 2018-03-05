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


    private manageAssignments(colony: Colony): void {
        let path = PathFinder.search(colony.nest.spawners[0].spawn.pos, { pos: colony.nest.room.controller.pos, range: 3 });
        let upgradeParts = colony.resourceManager.advisor.getUpgraderParts();
        let travelTime = path.cost;
        let maxParts =
            Math.floor(
                colony.nest.room.energyCapacityAvailable /
                (upgradeParts * BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE])
            ) - 2;

        let creeps = 1;
        if (maxParts < upgradeParts)
            creeps = Math.ceil(upgradeParts / maxParts);

        let body = BodyRepository.heavyUpgrader();
        body.maxCompleteScalingSections = maxParts - 1;

        let partCount = maxParts + 2;
        let spawnTime = partCount * 3;
        let transitTime = path.cost * partCount;
        let buffer = 15;
        let leadTime = spawnTime + transitTime + buffer;

        if (this.assignments.length > creeps)
            this.assignments.splice(0, this.assignments.length - creeps);

        for (var i = 0; i < this.assignments.length; i++) {
            this.assignments[i].body = body;
            this.assignments[i].replaceAt = leadTime;
        }

        let newAssignments = creeps - this.assignments.length;
        for (var i = 0; i < newAssignments; i++)
            this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_UPGRADER, leadTime));
    }

    protected onLoad(): void {
        
    }

    protected onUpdate(colony: Colony): void {
        this.colony = colony;
        if (Game.time % 1500 == 0)
            this.manageAssignments(colony);
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
        this.manageAssignments(colony);
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
            this.colony.resourceManager.structures.controllerContainerId,
            this.colony.nest.room.controller.id,
            this.colony.resourceManager.structures.controllerLinkId);
    }    
}

