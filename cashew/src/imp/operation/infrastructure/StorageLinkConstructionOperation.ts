import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class StorageLinkConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): StorageLinkConstructionOperation {
        let op = new this();
        return ConstructionOperation.fromMemory(memory, op) as StorageLinkConstructionOperation;
    }


    constructor() {
        super(OPERATION_STORAGE_LINK_CONSTRUCTION, 1);
    }

    protected onFinish(colony: Colony): boolean {
        let linkLoc = colony.nest.nestMap.mainBlock.getLinkLocation();
        let linkLook = colony.nest.room.lookForAt(LOOK_STRUCTURES, linkLoc.x, linkLoc.y);
        for (var i = 0; i < linkLook.length; i++) {
            if (linkLook[i].structureType == STRUCTURE_LINK) {
                colony.resourceManager.structures.storageLink = linkLook[i] as StructureLink;
                colony.resourceManager.structures.storageLinkId = linkLook[i].id;
                return true;
            }                
        }
        return false;
    }


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        let loc = colony.nest.nestMap.mainBlock.getLinkLocation();
        if (this.structureExists(colony.nest.room, loc, STRUCTURE_LINK))
            return [];
        return [loc];
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_LINK;
    }
}
