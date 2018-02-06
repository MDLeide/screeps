import { SpawnStrategy } from "./SpawnStrategy";

export class Spawner {
    private strategyDelegate: (spawn: StructureSpawn) => SpawnStrategy;

    constructor(spawnStrategyDelegate: (spawn: StructureSpawn) => SpawnStrategy) {
        this.strategyDelegate = spawnStrategyDelegate;
    }

    public spawn(): void {
        for (var spawnName in Game.spawns) {
            var s = Game.spawns[spawnName];
            if (s.spawning)
                continue;

            var strat = this.strategyDelegate(s);
            var egg = strat.getNextEgg(s);
            if (!egg) {
                continue;
            }

            console.log(
                "<span style='color:lightblue'>" +
                spawnName +
                "</span>" +
                " making " +
                "<span style='color:yellow'>" +
                egg.role +
                "</span>");

            //todo say and console

            var result = s.spawnCreep(egg.body.spawnArray, egg.name,
                {
                    memory: {
                        homeSpawnId: s.id,
                        roleId: egg.role,
                        role: null
                    }
                });

            if (result != OK) {
                console.log(
                    "<span style='color:lightblue'>" +
                    spawnName +
                    "</span><span style='color:red'>" +
                    " failed to spawn creep: " +
                    result.toString() +
                    "</span>");
            }
        }
    }
    
}
