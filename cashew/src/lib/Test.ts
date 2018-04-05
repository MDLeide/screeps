import { ColonyDefenseMonitor } from "../imp/colony/militaryMonitors/ColonyDefenseMonitor";
import { ObserverConstructionOperation } from "../imp/operation/infrastructure/ObserverConstructionOperation";
import { ExtensionFillOperation } from "../imp/operation/economic/ExtensionFillOperation";
import { ReplaceOriginalSpawnOperation } from "../imp/operation/infrastructure/ReplaceOriginalSpawnOperation";
import { Empire } from "../lib/empire/Empire";
import { BodyRepository } from "../imp/creep/BodyRepository";
import { Assignment } from "../lib/operation/Assignment";
import { RoomHelper } from "./util/RoomHelper";

export class Test {
    public recycleNearestCreeps(spawn?: (StructureSpawn | string)): string {
        if (spawn) {
            return this.recycleNearestCreeps(global.empire.colonies[0].nest.spawners[0].spawn);
        } else if (spawn instanceof StructureSpawn) {
            let creeps = spawn.pos.findInRange(FIND_CREEPS, 1);
            for (var i = 0; i < creeps.length; i++)
                spawn.recycleCreep(creeps[i]);
            
            return `Recycled ${creeps.length} creeps`;
        } else {
            return this.recycleNearestCreeps(Game.spawns[spawn]);
        }
    }

    public test(): string {
        let pos = new RoomPosition(5, 5, "E1N1");
        let converted = RoomHelper.getGlobalPosition(pos);
        let andBack = RoomHelper.getRoomPositionFromGlobalPosition(converted);


        console.log(`Converted: {${converted.x}, ${converted.y}}`);
        console.log(`Back: {${andBack.x}, ${andBack.y}, ${andBack.roomName}}`);

        return "";
    }    
}
