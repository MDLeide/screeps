import { StringBuilder } from "./util/StringBuilder";

export class Patch {
    public static patch(): void {
        
    }

    public static patchScreepsPlus(): void {
    }

    public static patchPrivate(): void {
        this.patchSpawnStatsAndCreepColonyTracking();
    }

    public static patchPublic(): void {
        this.patchSpawnStatsAndCreepColonyTracking();
    }

    public static patchSpawnStatsAndCreepColonyTracking() {
        this.addSpawnStatsMemoryToNests();
        this.changeCreepMemoryToTrackByColony();
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


