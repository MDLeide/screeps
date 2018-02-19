import { Colony } from "../../lib/colony/Colony";
import { Operation } from "../../lib/operation/Operation";
import { Assignment } from "../../lib/operation/Assignment";
import { BodyRepository } from "../spawn/BodyRepository";

export class OperationTemplate extends Operation {
    constructor() {
        super("opName", OperationTemplate.getAssignments());        
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


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }
    
    protected onSave(): OperationMemory {
        return null;
    }
}
