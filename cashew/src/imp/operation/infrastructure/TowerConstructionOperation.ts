import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";
import { BuilderJob } from "../../creep/BuilderJob";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class TowerConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: TowerConstructionOperationMemory): Operation {
        var op = new this(memory.rcl);
        return ConstructionOperation.fromMemory(memory, op);
    }

    constructor(rcl: number) {
        super(OPERATION_TOWER_CONSTRUCTION, 1);
        this.rcl = rcl;
    }


    public rcl: number;
    

    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return colony.nest.nestMap.mainBlock.getTowerLocations(this.rcl);
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_TOWER;
    }


    public save(): TowerConstructionOperationMemory {
        let mem = super.save() as TowerConstructionOperationMemory;
        mem.rcl = this.rcl;
        return mem;
    }
}

export interface TowerConstructionOperationMemory extends ConstructionOperationMemory {
    rcl: number;
}
