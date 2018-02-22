import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../spawn/BodyRepository";

export class ControllerInfrastructureOperation extends Operation {
    public static fromMemory(memory: OperationMemory): Operation {
        var op = new this();
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super("controllerInfrastructure", ControllerInfrastructureOperation.getAssignments());        
    }

    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder"),
            new Assignment("", BodyRepository.getBody("lightWorker"), "builder")
        ];
    }

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        var containerLocation = colony.nest.nestMap.controllerBlock.getContainerLocation();
        var look = colony.nest.room.lookForAt(LOOK_STRUCTURES, containerLocation.x, containerLocation.y);
        for (var i = 0; i < look.length; i++) 
            if (look[i].structureType == STRUCTURE_CONTAINER)
                return true;        
        return false;
    }

    
    protected onInit(colony: Colony): boolean {
        var containerLocation = colony.nest.nestMap.controllerBlock.getContainerLocation();
        var result = colony.nest.room.createConstructionSite(containerLocation.x, containerLocation.y, STRUCTURE_CONTAINER);
        return result == OK;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        var containerLocation = colony.nest.nestMap.controllerBlock.getContainerLocation();
        var look = colony.nest.room.lookForAt(LOOK_STRUCTURES, containerLocation.x, containerLocation.y);
        for (var i = 0; i < look.length; i++) {
            if (look[i].structureType == STRUCTURE_CONTAINER) {
                (look[i] as StructureContainer).nut.tag = "controller";
                return true;
            }
        }
        return false;
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
    
    protected onSave(): OperationMemory {
        return null;
    }
}
