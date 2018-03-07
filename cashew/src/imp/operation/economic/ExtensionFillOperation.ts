import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { FillerController } from "../../creep/FillerController";

export class ExtensionFillOperation extends ControllerOperation {
    public static fromMemory(memory: ExtensionFillOperationMemory): Operation {
        let op = new this();
        op.linkId = memory.linkId;
        op.pathAStandLocation = memory.pathAStandLocation;
        op.pathBStandLocation = memory.pathBStandLocation;
        op.lastAssignedWasA = memory.lastAssignedWasA;
        return ControllerOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_EXTENSION_FILL, []);
    }


    public linkId: string
    public pathAStandLocation: { x: number, y: number };
    public pathBStandLocation: { x: number, y: number };
    public lastAssignedWasA: boolean;


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
        this.linkId = colony.resourceManager.structures.extensionLinkId;

        let body = BodyRepository.hauler();
        body.maxCompleteScalingSections = 20;
        let block = colony.nest.nestMap.extensionBlock;

        this.pathAStandLocation = block.getStandALocation();
        this.pathBStandLocation = block.getStandBLocation();

        this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_FILLER, 20));
        this.assignments.push(new Assignment("", body, CREEP_CONTROLLER_FILLER, 20));
        return true;
    }

    protected onStart(colony: Colony): boolean {
        colony.resourceManager.extensionsManagedDirectly = true;
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
        if (this.lastAssignedWasA) {
            this.lastAssignedWasA = !this.lastAssignedWasA;
            return new FillerController(this.pathBStandLocation, false, this.linkId);
        } else {
            this.lastAssignedWasA = !this.lastAssignedWasA;
            return new FillerController(this.pathAStandLocation, true, this.linkId);
        } 
    }


    protected onSave(): ExtensionFillOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            linkId: this.linkId,
            pathAStandLocation: this.pathAStandLocation,
            pathBStandLocation: this.pathBStandLocation,
            lastAssignedWasA: this.lastAssignedWasA
        };
    }
}

export interface ExtensionFillOperationMemory extends ControllerOperationMemory {
    linkId: string
    pathAStandLocation: { x: number, y: number };
    pathBStandLocation: { x: number, y: number };
    lastAssignedWasA: boolean;
}
