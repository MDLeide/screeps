import { StringBuilder } from "./util/StringBuilder";

export class Patch {
    /** Call to execute any memory patching functions. This is called before Empire is created. */
    public static patchMemory(): void {
        let shard = Game.shard.name;
        if (shard == "screepsplus1")
            this.patchScreepsPlusMemory();
        else if (shard == "DESKTOP-4J3SHMB")
            this.patchPrivateMemory();
        else
            this.patchPublicMemory();
    }

    /** Call to execute any patches that rely on Empire. */
    public static patchEmpire(): void {
        let shard = Game.shard.name;
        if (shard == "screepsplus1")
            this.patchScreepsPlus();
        else if (shard == "DESKTOP-4J3SHMB")
            this.patchPrivate();
        else
            this.patchPublic();
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
            this.resetExtensionFillOps
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
            this.patchStandardColonyMonitorMemory,
            this.patchResourceManagerMemory,
            this.resetExtensionFillOps
        ]);
    }

    private static patchPublic(): void {
        this.doPatch([            
        ]);
    }

    //
    // PATCHES
    //

    private static resetExtensionFillOps(): void {
        for (let colony in Memory.empire.colonies) {
            for (var i = 0; i < Memory.empire.colonies[colony].operations.operations.length; i++) {
                let op = Memory.empire.colonies[colony].operations.operations[i];
                if (!op || !op.type || op.type == OPERATION_EXTENSION_FILL)
                    Memory.empire.colonies[colony].operations.operations.splice(i--, 1);
            }
        }
        for (let creep in Memory.creeps) {
            if (Memory.creeps[creep].operation == OPERATION_EXTENSION_FILL)
                Memory.creeps[creep].operation = undefined;
        }
    }

    private static patchStandardColonyMonitorMemory(): void {
        for (let key in Memory.empire.colonies) {
            let c = Memory.empire.colonies[key];
            if (c.monitorManager.provider as any == "Standard")
                c.monitorManager.provider = MONITOR_PROVIDER_COLONY_STANDARD;
        }
    }

    private static patchResourceManagerMemory(): void {
        for (let key in Memory.empire.colonies) {
            let c = Memory.empire.colonies[key];
            if (!c.resourceManager.structures.storageContainerIds)
                c.resourceManager.structures.storageContainerIds = [];
        }
    }

    //
    // ARCHIVE
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
            colony.operations.cancelOperationByType(colony, OPERATION_LIGHT_UPGRADE);
            colony.operations.cancelOperationByType(colony, OPERATION_CONTROLLER_INFRASTRUCTURE);
            colony.operations.cancelOperationByType(colony, OPERATION_HARVEST_INFRASTRUCTURE);
            colony.operations.cancelOperationByType(colony, OPERATION_NEW_SPAWN_CONSTRUCTION);
        }
    }
}


