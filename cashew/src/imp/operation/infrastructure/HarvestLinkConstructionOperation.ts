import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class HarvestLinkConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: HarvestLinkConstructionOperationMemory): Operation {
        let op = new this(memory.sourceId);
        return ConstructionOperation.fromMemory(memory, op);
    }


    constructor(sourceId: string) {
        super(OPERATION_HARVEST_LINK_CONSTRUCTION, 1);
        this.sourceId = sourceId;
    }


    public sourceId: string;


    protected onFinish(colony: Colony): boolean {
        let linkLocation: { x: number, y: number };

        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            let sourceLocation = colony.nest.nestMap.harvestBlocks[i].getSourceLocation();
            let sourceLook = colony.nest.room.lookForAt(LOOK_SOURCES, sourceLocation.x, sourceLocation.y);
            if (sourceLook.length) {
                if (sourceLook[0].id == this.sourceId) {
                    linkLocation = colony.nest.nestMap.harvestBlocks[i].getLinkLocation();
                    break;
                }
            }
        }

        let linkLook = colony.nest.room.lookForAt(LOOK_STRUCTURES, linkLocation.x, linkLocation.y);
        if (linkLook.length) {
            if (linkLook[0].structureType == STRUCTURE_LINK) {
                colony.resourceManager.setSourceLink(this.sourceId, linkLook[0].id);
            }
        }
        return super.onFinish(colony);
    }


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        for (var i = 0; i < colony.nest.nestMap.harvestBlocks.length; i++) {
            let sourceLocation = colony.nest.nestMap.harvestBlocks[i].getSourceLocation();
            let sourceLook = colony.nest.room.lookForAt(LOOK_SOURCES, sourceLocation.x, sourceLocation.y);
            if (sourceLook.length) {
                if (sourceLook[0].id == this.sourceId) {
                    let location = colony.nest.nestMap.harvestBlocks[i].getLinkLocation();
                    if (this.structureExists(colony.nest.room, location, STRUCTURE_LINK))
                        return [];
                    return [location];
                }
            }
        }
        return null;
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_LINK;
    }


    public save(): HarvestLinkConstructionOperationMemory {
        let mem = super.save() as HarvestLinkConstructionOperationMemory;
        mem.sourceId = this.sourceId;
        return mem;
    }
}

export interface HarvestLinkConstructionOperationMemory extends ConstructionOperationMemory {
    sourceId: string;
}
