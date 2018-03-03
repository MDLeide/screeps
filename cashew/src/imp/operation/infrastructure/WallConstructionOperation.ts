import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
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
        ];
    }


    protected onLoad(): void { }

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
        return true;
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

    protected onCancel(): void {
    }
    

    protected onRelease(assignment: Assignment): void {
    }

    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }


    protected getController(assignment: Assignment): MasonController {
        return new MasonController();
    }


    protected onSave(): ControllerOperationMemory {
        return null;
    }
}
