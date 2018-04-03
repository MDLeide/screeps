import { StringBuilder } from "./util/StringBuilder";

export class Patch {
    public static patch(): void {
        let shard = Game.shard.name;
        if (shard == "screepsplus1") {
            this.patchScreepsPlus();
        }
    }


    private static patchScreepsPlus(): void {
        this.doPatch([
            
        ]);
    }

    private static patchPrivate(): void {
        this.doPatch([
            this.addSpawnStatsMemoryToNests,
            this.changeCreepMemoryToTrackByColony,
            this.addSpawningColony,
            this.updateOperationAssignments
        ]);
    }

    private static patchPublic(): void {
        this.doPatch([
            this.addSpawnStatsMemoryToNests,
            this.changeCreepMemoryToTrackByColony,
            this.addSpawningColony,
            this.updateOperationAssignments
        ]);
    }

    private static doPatch(functions: Function[]): void {
        for (var i = 0; i < functions.length; i++) {
            global.events.system.patch(functions[i].name);
            functions[i]();
        }
    }

    //private static doPatch(functions: { func: ()=>void, name: string  }[]): void {
    //    for (var i = 0; i < functions.length; i++) {
    //        global.events.system.patch(functions[i].name);
    //        functions[i].func();
    //    }
    //}


    private static updateOperationAssignments(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];
            colony.operations.cancelOperationByType(OPERATION_LIGHT_UPGRADE);
            colony.operations.cancelOperationByType(OPERATION_CONTROLLER_INFRASTRUCTURE);
            colony.operations.cancelOperationByType(OPERATION_HARVEST_INFRASTRUCTURE);
            colony.operations.cancelOperationByType(OPERATION_NEW_SPAWN_CONSTRUCTION);
        }
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


