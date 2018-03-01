import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";
import { Assignment } from "../../lib/operation/Assignment";
import { BodyRepository } from "../creep/BodyRepository";

export class OperationTemplate extends Operation {
    public static fromMemory(memory: OperationMemory): Operation {
        var op = new this();
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_HARVEST, OperationTemplate.getAssignments());        
    }

    private static getAssignments(): Assignment[] {
        return [

        ];
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

    protected onCancel() {
    }

    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    protected onRelease(assignment: Assignment): void {
    }

    protected onReplacement(assignment: Assignment): void {
    }

    protected onSave(): OperationMemory {
        return null;
    }
}
