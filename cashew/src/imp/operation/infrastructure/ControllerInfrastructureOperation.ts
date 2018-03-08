import { Colony } from "../../../lib/colony/Colony";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { Job } from "../../../lib/creep/Job";
import { Operation } from "../../../lib/operation/Operation";
import { BuilderJob } from "../../creep/BuilderJob";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class ControllerInfrastructureOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): Operation {
        var op = new this();
        return ConstructionOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_CONTROLLER_INFRASTRUCTURE, 1);
    }
    

    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return [colony.nest.nestMap.controllerBlock.getContainerLocation()];
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_CONTAINER;
    }    
    
    protected onFinish(colony: Colony): boolean {
        var containerLocation = colony.nest.nestMap.controllerBlock.getContainerLocation();
        var look = colony.nest.room.lookForAt(LOOK_STRUCTURES, containerLocation.x, containerLocation.y);
        for (var i = 0; i < look.length; i++) {
            if (look[i].structureType == STRUCTURE_CONTAINER) {
                colony.resourceManager.structures.controllerContainerId = look[i].id;
                colony.resourceManager.structures.controllerContainer = look[i] as StructureContainer;
                return true;
            }
        }
        return super.onFinish(colony);
    }

    protected onSave(): ConstructionOperationMemory {
        return null;
    }
}
