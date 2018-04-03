import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class TerminalConstructionOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): TerminalConstructionOperation {
        let op = new this();
        return ConstructionOperation.fromMemory(memory, op) as TerminalConstructionOperation;
    }


    constructor() {
        super(OPERATION_TERMINAL_CONSTRUCTION, 1);
    }
    

    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        return [colony.nest.nestMap.mainBlock.getTerminalLocation()];
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_TERMINAL;
    }
}
