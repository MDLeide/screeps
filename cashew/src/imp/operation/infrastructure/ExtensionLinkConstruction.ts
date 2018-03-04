import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class ExtensionLinkConstruction extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): Operation {
        var op = new this();
        return JobOperation.fromMemory(memory, op);
    }


    constructor() {
        super(OPERATION_EXTENSION_LINK_CONSTRUCTION, 1);
    }


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return [colony.nest.nestMap.extensionBlock.getLinkLocation()];
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_LINK;
    }
    
    protected onFinish(colony: Colony): boolean {
        let linkLocation = colony.nest.nestMap.controllerBlock.getLinkLocation();               
        let linkLook = colony.nest.room.lookForAt(LOOK_STRUCTURES, linkLocation.x, linkLocation.y);
        if (linkLook.length) {
            if (linkLook[0].structureType == STRUCTURE_LINK) {
                colony.resourceManager.structures.controllerLink = linkLook[0] as StructureLink;
                colony.resourceManager.structures.controllerLinkId = linkLook[0].id;
            }
        }
        return super.onFinish(colony);
    }    
}
