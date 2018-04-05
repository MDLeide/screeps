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


    protected getSiteLocations(colony: Colony): { x: number, y: number }[] {
        console.log("enter getSiteLocations for replaceSpawn op");
        let missing: boolean = false;

        let orphan: StructureSpawn;

        let loc1 = colony.nest.nestMap.mainBlock.getSpawnLocation(1);        
        let loc2 = colony.nest.nestMap.mainBlock.getSpawnLocation(7);        
        let loc3 = colony.nest.nestMap.mainBlock.getSpawnLocation(8);
        
        let spawns = colony.nest.room.find<StructureSpawn>(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN });
        for (var i = 0; i < spawns.length; i++) {
            let s = spawns[i];
            if (this.positionsMatch(s, loc1))
                continue;            
            if (this.positionsMatch(s, loc2))
                continue;            
            if (this.positionsMatch(s, loc3))
                continue;            
            s.destroy();
        }

        if (!this.lookForSpawn(colony.nest.room, loc1.x, loc1.y))
            return [loc1];
        if (!this.lookForSpawn(colony.nest.room, loc2.x, loc2.y))
            return [loc2];
        if (!this.lookForSpawn(colony.nest.room, loc3.x, loc3.y))
            return [loc3];

        return [];
    }
    
    protected getStructureType(): BuildableStructureConstant {
        return STRUCTURE_SPAWN;
    }


    private lookForSpawn(room: Room, x: number, y: number) {
        let look = room.lookForAt(LOOK_STRUCTURES, x, y);
        for (var i = 0; i < look.length; i++)
            if (look[i].structureType == STRUCTURE_SPAWN)
                return true;
        return false;
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
}

