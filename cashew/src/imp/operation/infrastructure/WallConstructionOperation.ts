import { Colony } from "../../../lib/colony/Colony";
import { Operation, StartStatus, InitStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { MapBlock } from "../../../lib/map/base/MapBlock";
import { HarvestBlock } from "../../../lib/map/blocks/HarvestBlock";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { MasonController } from "../../creep/MasonController";

export class WallConstructionOperation extends ControllerOperation {   
    public static fromMemory(memory: ControllerOperationMemory): WallConstructionOperation {
        var op = new this();
        return ControllerOperation.fromMemory(memory, op) as WallConstructionOperation;
    }

    constructor() {
        super(OPERATION_WALL_CONSTRUCTION, WallConstructionOperation.getAssignments());
    }

    private static getAssignments(): Assignment[]{
        return [
            new Assignment("", BodyRepository.lightWorker(), CREEP_CONTROLLER_MASON)
        ];
    }


    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected getController(assignment: Assignment): MasonController {
        return new MasonController();
    }


    protected onLoad(): void { }

    protected onUpdate(colony: Colony): void {
        if (Game.time % 250 == 0)
            this.checkSites(colony);
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


    private checkSites(colony: Colony): void {
        for (var x = 0; x < 50; x++) {
            for (var y = 0; y < 50; y++) {
                if (colony.nest.nestMap.map.getStructureAt(x, y) == STRUCTURE_WALL) {
                    let look = colony.nest.room.lookForAt(LOOK_STRUCTURES, x, y);
                    for (var i = 0; i < look.length; i++)
                        if (look[i].structureType == STRUCTURE_WALL)
                            continue;

                    colony.nest.room.createConstructionSite(x, y, STRUCTURE_WALL);
                } else if (colony.nest.nestMap.map.getRampartAt(x, y)) {
                    let look = colony.nest.room.lookForAt(LOOK_STRUCTURES, x, y);
                    for (var i = 0; i < look.length; i++)
                        if (look[i].structureType == STRUCTURE_RAMPART)
                            continue;

                    colony.nest.room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                }
            }
        }
    }



    protected onSave(): ControllerOperationMemory {
        return null;
    }
}
