import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
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


    public isFinished(colony: Colony): boolean {
        return false;
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


    protected onInit(colony: Colony): InitStatus {
        this.manageAssignments(colony);
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


    protected getController(assignment: Assignment): UpgraderController {
        return new UpgraderController(
            this.colony.resourceManager.structures.controllerContainerId,
            this.colony.nest.room.controller.id,
            this.colony.resourceManager.structures.controllerLinkId);
    }


    private manageAssignments(colony: Colony): void {
        let upgradeParts = colony.resourceManager.advisor.getUpgraderParts();
        let possiblePartsPerSpawn = Math.floor((colony.nest.room.energyCapacityAvailable - BODYPART_COST[CARRY] - BODYPART_COST[MOVE]) / BODYPART_COST[WORK]);
        possiblePartsPerSpawn = Math.min(possiblePartsPerSpawn, 30);
        let creepsRequired = Math.ceil(upgradeParts / possiblePartsPerSpawn);
        let partsPerSpawn = Math.ceil(upgradeParts / creepsRequired);
        let body = BodyRepository.heavyUpgrader();
        body.maxCompleteScalingSections = partsPerSpawn - 1;

        let path = PathFinder.search(colony.nest.spawners[0].spawn.pos, { pos: colony.nest.room.controller.pos, range: 1 });
        let partCount = partsPerSpawn + 2;
        let spawnTime = partCount * 3;
        let transitTime = path.cost * partCount;
        let buffer = 50;
        let leadTime = spawnTime + transitTime + buffer;

        if (this.assignments.length > creepsRequired)
            this.assignments.splice(0, this.assignments.length - creepsRequired);

        for (var i = 0; i < this.assignments.length; i++) {
            this.assignments[i].body = body;
            this.assignments[i].replaceAt = leadTime;
        }

        let newAssignments = creepsRequired - this.assignments.length;
        for (var i = 0; i < newAssignments; i++)
            this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_UPGRADER, leadTime));
    }
}

