import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { FillerController } from "../../creep/FillerController";

export class ExtensionFillOperation extends ControllerOperation {
    public static fromMemory(memory: ControllerOperationMemory): Operation {
        let op = new this();
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_EXTENSION_FILL, []);   
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


    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }


    protected getController(assignment: Assignment): CreepController {
        return new FillerController();
    }


    protected onSave(): ControllerOperationMemory {
        return null;
    }
}
