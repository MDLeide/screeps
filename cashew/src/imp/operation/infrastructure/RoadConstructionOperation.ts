import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { MapBlock } from "../../../lib/map/base/MapBlock";
import { HarvestBlock } from "../../../lib/map/blocks/HarvestBlock";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { MasonController } from "../../creep/MasonController";

export class RoadConstructionOperation extends ControllerOperation {   
    public static fromMemory(memory: ControllerOperationMemory): RoadConstructionOperation {
        var op = new this();
        return ControllerOperation.fromMemory(memory, op) as RoadConstructionOperation;
    }

    constructor() {
        super(OPERATION_ROAD_CONSTRUCTION, RoadConstructionOperation.getAssignments());
    }

    private static getAssignments(): Assignment[]{
        return [            
        ];
    }


    public isFinished(colony: Colony): boolean {
        return true;
    }


    protected getController(assignment: Assignment): MasonController {
        return new MasonController();
    }


    protected onLoad(): void { }

    protected onUpdate(colony: Colony): void {
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

    protected onCancel(): void {
    }    
}
