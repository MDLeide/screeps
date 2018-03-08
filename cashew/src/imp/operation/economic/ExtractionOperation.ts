import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { ExtractorController } from "../../creep/ExtractorController";

export class ExtractionOperation extends ControllerOperation {
    public static fromMemory(memory: ControllerOperationMemory): Operation {
        let op = new this();
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_EXTRACTION, []);   
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


    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }


    protected getController(assignment: Assignment): CreepController {
        return new ExtractorController();
    }


    protected onSave(): ControllerOperationMemory {
        return null;
    }
}
