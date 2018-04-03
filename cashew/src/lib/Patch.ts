import { StringBuilder } from "./util/StringBuilder";

export class Patch {
    /** Call to execute any memory patching functions. This is called before Empire is created. */
    public static patchMemory(): void {
        let shard = Game.shard.name;
        if (shard == "screepsplus1")
            this.patchScreepsPlusMemory();
        else if (shard == "DESKTOP-4J3SHMB")
            this.patchPrivateMemory();
    }

    /** Call to execute any patches that rely on Empire. */
    public static patchEmpire(): void {
        let shard = Game.shard.name;
        if (shard == "screepsplus1")
            this.patchScreepsPlus();
        else if (shard == "DESKTOP-4J3SHMB")
            this.patchPrivate();
    }

    private static doPatch(functions: Function[]): void {
        for (var i = 0; i < functions.length; i++) {
            global.events.system.patch(functions[i].name);
            functions[i]();
        }
    }

    //
    // SCREEPS PLUS
    //

    private static patchScreepsPlusMemory(): void {
        this.doPatch([

        ]);

    }
    private static patchScreepsPlus(): void {
        this.doPatch([
            
        ]);
    }

    //
    //  PRIVATE SERVER
    //

    private static patchPrivateMemory(): void {
        this.doPatch([
        ]);
    }

    private static patchPrivate(): void {
        this.doPatch([            
        ]);
    }

    //
    // PUBLIC SERVER
    //

    private static patchPublicMemory(): void {
        this.doPatch([
            this.addSpawnStatsMemoryToNests,
            this.changeCreepMemoryToTrackByColony,
            this.addSpawningColony
        ]);
    }

    private static patchPublic(): void {
        this.doPatch([
            this.updateOperationAssignments
        ]);
    }

    //
    // PATCHES
    //

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
                let colony: string;
                for (let key in Memory.empire.colonies) {
                    let found = false;
                    let c = Memory.empire.colonies[key];
                    let room = Game.rooms[c.nest.roomName];
                    if (room) {
                        let spawns = room.find<StructureSpawn>(FIND_MY_STRUCTURES, { filter: p => p.structureType == STRUCTURE_SPAWN });
                        for (var i = 0; i < spawns.length; i++) {
                            if (spawns[i].id == mem.homeSpawnId) {
                                colony = key;
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found)
                        break;
                }
                                
                mem.colony = colony;
                mem.homeSpawnId = undefined;
            }
        }
    }

    // EMPIRE RELIANT
    
    private static updateOperationAssignments(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];
            colony.operations.cancelOperationByType(OPERATION_LIGHT_UPGRADE);
            colony.operations.cancelOperationByType(OPERATION_CONTROLLER_INFRASTRUCTURE);
            colony.operations.cancelOperationByType(OPERATION_HARVEST_INFRASTRUCTURE);
            colony.operations.cancelOperationByType(OPERATION_NEW_SPAWN_CONSTRUCTION);
        }
    }
}


