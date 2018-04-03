import { StringBuilder } from "./util/StringBuilder";

export class Patch {
    public static patch(): void {
        let shard = Game.shard.name;
        if (shard == "screepsplus1") {
            this.patchScreepsPlus();
        }
    }

    public static patchScreepsPlus(): void {
        this.addSpawningColony();
    }

    public static patchPrivate(): void {
        this.addSpawnStatsMemoryToNests();
        this.changeCreepMemoryToTrackByColony();
        this.addSpawningColony();
    }

    public static patchPublic(): void {
        this.addSpawnStatsMemoryToNests();
        this.changeCreepMemoryToTrackByColony();
        this.addSpawningColony();
    }

    private static addSpawningColony(): void {
        for (let key in Memory.creeps) {
            let mem = Memory.creeps[key];
            if (!mem.spawningColony)
                mem.spawningColony = mem.colony;
        }
    }

    private static addSpawnStatsMemoryToNests(): void {
        for (let key in Memory.empire.colonies) {
            let c = Memory.empire.colonies[key];
            c.nest.spawnStats = {
                currentPeriod: {
                    adjustedTicksSpentSpawning: 0,
                    periodStart: Game.time
                },
                history: []
            }
        }
    }

    private static changeCreepMemoryToTrackByColony(): void {
        for (let key in Memory.creeps) {
            let mem = Memory.creeps[key] as any;
            if (mem.homeSpawnId) {
                let colony = global.empire.getColonyBySpawn(mem.homeSpawnId);
                mem.colony = colony.name;
                mem.homeSpawnId = undefined;
            }
        }
    }
}


