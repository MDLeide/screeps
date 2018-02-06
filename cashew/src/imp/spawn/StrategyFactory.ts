import { RC1SpawnStrategy } from "./RC1SpawnStrategy";
import { RC2SpawnStrategy } from "./RC2SpawnStrategy";
import { SpawnStrategy } from "../../lib/spawn/SpawnStrategy";

export class StrategyFactory {
    public getStrategy(spawn: StructureSpawn): SpawnStrategy {
        if (spawn.room.controller && spawn.room.controller.level == 1) {
            return new RC1SpawnStrategy();
        } else if (spawn.room.controller && spawn.room.controller.level == 2) {
            return new RC2SpawnStrategy();
        } else {
            return new RC2SpawnStrategy();
        }
    }
}
