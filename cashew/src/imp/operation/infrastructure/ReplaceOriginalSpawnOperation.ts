import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { JobOperation } from "../../../lib/operation/JobOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BuilderJob } from "../../creep/BuilderJob";
import { BodyRepository } from "../../creep/BodyRepository";
import { ConstructionOperation, ConstructionOperationMemory } from "../ConstructionOperation";

export class ReplaceOriginalSpawnOperation extends ConstructionOperation {
    public static fromMemory(memory: ConstructionOperationMemory): ReplaceOriginalSpawnOperation {
        let op = new this();
        return ConstructionOperation.fromMemory(memory, op) as ReplaceOriginalSpawnOperation;
    }


    constructor() {
        super(OPERATION_REPLACE_ORIGINAL_SPAWN, 1);        
    }


    public canInit(colony: Colony): boolean {
        return true;
    }

    public onInit(colony: Colony): boolean {
        return true;
    }


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        let missing: boolean = false;

        let orphan: StructureSpawn;

        let loc1 = colony.nest.nestMap.mainBlock.getSpawnLocation(1);
        let loc1Missing = true;
        let loc2 = colony.nest.nestMap.mainBlock.getSpawnLocation(7);
        let loc2Missing = true;
        let loc3 = colony.nest.nestMap.mainBlock.getSpawnLocation(8);
        let loc3Missing = true;

        let spawns = colony.nest.room.find<StructureSpawn>(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
        for (var i = 0; i < spawns.length; i++) {
            let s = spawns[i];
            if (this.positionsMatch(s, loc1)) {
                loc1Missing = false;
                continue;
            }
            if (this.positionsMatch(s, loc2)) {
                loc2Missing = false;
                continue;
            }
            if (this.positionsMatch(s, loc3)) {
                loc3Missing = false;
                continue;
            }
            orphan = s;
        }

        if (orphan)
            orphan.destroy();

        if (loc1Missing)
            return [loc1];
        else if (loc2Missing)
            return [loc2];
        else if (loc3Missing)
            return [loc3];

        return [];
    }

    private positionsMatch(spawn: StructureSpawn, location: { x: number, y: number }): boolean {
        return spawn.pos.x == location.x && spawn.pos.y == location.y;
    }

    private checkForSpawn(room: Room, x: number, y: number): boolean {
        let lookSpawn = room.lookForAt(LOOK_STRUCTURES, x, y);
        for (var i = 0; i < lookSpawn.length; i++) {
            if (lookSpawn[i].structureType == STRUCTURE_SPAWN) {                
                return true;
            }                 
        }
        return false;
    }

    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_SPAWN;
    }

    protected onSave(): ConstructionOperationMemory {
        return null;
    }
}

