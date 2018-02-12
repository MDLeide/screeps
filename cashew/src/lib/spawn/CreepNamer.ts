import { Spawner } from "../spawn/Spawner";
import { SpawnDefinition } from "../spawn/SpawnDefinition";

export class CreepNamer {
    public static getCreepName(spawnDef: SpawnDefinition, spawner: Spawner): string {
        var timeString = Game.time.toString();
        var time = timeString.slice(timeString.length - 4);
        return spawnDef.roleId + "-" + spawner.spawn.name + "-" + time;
    }
}
