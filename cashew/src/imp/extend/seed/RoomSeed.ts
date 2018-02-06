import { Seed } from "../../../lib/extend/Seed";

// todo: there has got to be a better way to do this...
// but i've tried every generic type coercion trick i
// know, and i can't make it work

export class RoomSeed extends Seed<Room> {
    constructor(room: Room) {
        super(room);
    }

    public get room(): Room {
        return this.screepsObject;
    }

    public findExitsTop(opts?: FilterOptions<FIND_EXIT_TOP>): RoomPosition[] {
        return this.room.find<FIND_EXIT_TOP>(FIND_EXIT_TOP, opts)
    };

    public findExitsRight(opts?: FilterOptions<FIND_EXIT_RIGHT>): RoomPosition[] {
        return this.room.find<FIND_EXIT_RIGHT>(FIND_EXIT_RIGHT, opts)
    };

    public findExitsBottom(opts?: FilterOptions<FIND_EXIT_BOTTOM>): RoomPosition[] {
        return this.room.find<FIND_EXIT_BOTTOM>(FIND_EXIT_BOTTOM, opts)
    };

    public findExitsLeft(opts?: FilterOptions<FIND_EXIT_LEFT>): RoomPosition[] {
        return this.room.find<FIND_EXIT_LEFT>(FIND_EXIT_LEFT, opts)
    };

    public findExits(opts?: FilterOptions<FIND_EXIT>): RoomPosition[] {
        return this.room.find<FIND_EXIT>(FIND_EXIT, opts)
    };

    public findCreeps(opts?: FilterOptions<FIND_CREEPS>): Creep[] {
        return this.room.find<FIND_CREEPS>(FIND_CREEPS, opts)
    };

    public findMyCreeps(opts?: FilterOptions<FIND_MY_CREEPS>): Creep[] {
        return this.room.find<FIND_MY_CREEPS>(FIND_MY_CREEPS, opts)
    };

    public findHostileCreeps(opts?: FilterOptions<FIND_HOSTILE_CREEPS>): Creep[] {
        return this.room.find<FIND_HOSTILE_CREEPS>(FIND_HOSTILE_CREEPS, opts)
    };

    public findActiveSources(opts?: FilterOptions<FIND_SOURCES_ACTIVE>): Source[] {
        return this.room.find<FIND_SOURCES_ACTIVE>(FIND_SOURCES_ACTIVE, opts)
    };

    public findSources(opts?: FilterOptions<FIND_SOURCES>): Source[] {
        return this.room.find<FIND_SOURCES>(FIND_SOURCES, opts)
    };
    
    public findDroppedResources(opts?: FilterOptions<FIND_DROPPED_RESOURCES>): Resource<ResourceConstant>[] {
        return this.room.find(FIND_DROPPED_RESOURCES, opts);
    };

    public findStructures(opts?: FilterOptions<FIND_STRUCTURES>): AnyStructure[] {
        return this.room.find<FIND_STRUCTURES>(FIND_STRUCTURES, opts)
    };

    public findMyStructures(opts?: FilterOptions<FIND_MY_STRUCTURES>): AnyOwnedStructure[] {
        return this.room.find<FIND_MY_STRUCTURES>(FIND_MY_STRUCTURES, opts)
    };

    public findHostileStructures(opts?: FilterOptions<FIND_HOSTILE_STRUCTURES>): AnyOwnedStructure[] {
        return this.room.find<FIND_HOSTILE_STRUCTURES>(FIND_HOSTILE_STRUCTURES, opts)
    };

    public findFlags(opts?: FilterOptions<FIND_FLAGS>): Flag[] {
        return this.room.find<FIND_FLAGS>(FIND_FLAGS, opts)
    };

    public findConstructionSites(opts?: FilterOptions<FIND_CONSTRUCTION_SITES>): ConstructionSite<BuildableStructureConstant>[] {
        return this.room.find<FIND_CONSTRUCTION_SITES>(FIND_CONSTRUCTION_SITES, opts)
    };

    public findMySpawns(opts?: FilterOptions<FIND_MY_SPAWNS>): StructureSpawn[] {
        return this.room.find<FIND_MY_SPAWNS>(FIND_MY_SPAWNS, opts)
    };

    public findHostileSpawns(opts?: FilterOptions<FIND_HOSTILE_SPAWNS>): StructureSpawn[] {
        return this.room.find<FIND_HOSTILE_SPAWNS>(FIND_HOSTILE_SPAWNS, opts)
    };

    public findMyConstructionSites(opts?: FilterOptions<FIND_MY_CONSTRUCTION_SITES>): ConstructionSite<BuildableStructureConstant>[] {
        return this.room.find<FIND_MY_CONSTRUCTION_SITES>(FIND_MY_CONSTRUCTION_SITES, opts)
    };

    public findHostileConstructionSites(opts?: FilterOptions<FIND_HOSTILE_CONSTRUCTION_SITES>): ConstructionSite<BuildableStructureConstant>[] {
        return this.room.find<FIND_HOSTILE_CONSTRUCTION_SITES>(FIND_HOSTILE_CONSTRUCTION_SITES, opts)
    };

    public findMinerals(opts?: FilterOptions<FIND_MINERALS>): Mineral<MineralConstant>[] {
        return this.room.find<FIND_MINERALS>(FIND_MINERALS, opts)
    };

    public findNukes(opts?: FilterOptions<FIND_NUKES>): Nuke[] {
        return this.room.find<FIND_NUKES>(FIND_NUKES, opts)
    };
    
    public get containers(): StructureContainer[] {
        var containers = this.room.find<StructureContainer>(
            FIND_STRUCTURES, {
                filter: function (struct: Structure) {
                    return struct.structureType === STRUCTURE_CONTAINER;
                }
            });
        return containers;
    }
}
