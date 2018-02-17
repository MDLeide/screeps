import { Cleaner } from "./lib/debug/Cleaner";
import { Logger } from "./lib/debug/Logger";

import { IRoleState } from "./lib/creep/role/state/IRoleState";

import { CreepNut } from "./imp/extend/nut/CreepNut";
import { RoomNut } from "./imp/extend/nut/RoomNut";
import { SourceNut } from "./imp/extend/nut/SourceNut";
import { SpawnNut } from "./imp/extend/nut/SpawnNut";
import { ContainerNut } from "./imp/extend/nut/ContainerNut";
import { ControllerNut } from "./imp/extend/nut/ControllerNut";

import { TowerController } from "./imp/tower/TowerController";


declare global {
    const global: global;

    interface global {
        cleaner: Cleaner;
        logger: Logger;
        pause(): void;
    }

    interface StructureTower {
        controller: TowerController | null | undefined;
    }

    interface Creep {
        nut: CreepNut;
    }

    interface Room {
        nut: RoomNut;
    }

    interface Source {
        nut: SourceNut;
    }

    interface StructureSpawn {
        nut: SpawnNut;
    }

    interface StructureContainer {
        nut: ContainerNut;        
    }

    interface StructureController {
        nut: ControllerNut;
    }

    //**        **//
    /*** MEMORY ***/
    //**        **//

    interface Memory {
        containers: { [containerId: string]: ContainerMemory };
        controllers: { [controllerId: string]: ControllerMemory };
        sources: { [sourceId: string]: SourceMemory };

        colonies: { [colonyId: string]: ColonyMemory };
        nests: { [nestId: string]: NestMemory };
        
        operationGroups: { [opGroupId: string]: OperationGroupMemory };
        operations: { [operationId: string]: ColonyOperationMemory };
        plans: { [planId: string]: ColonyPlanMemory };

        mapBlocks: { [mapBlockId: string]: MapBlockMemory };
    }


    /** SCREEPS OBJECTS **/

    interface CreepMemory {
        roleId: string;
        role: IRoleState | null;
        homeSpawnId: string;
        spawnDefId: string;
        birthTick: number;
        deathTick: number;
    }

    interface ContainerMemory {
        id: string;
        /*Describes the usage of this container.*/
        tag: string;
        /*Holds the ID of the object this container supports.*/
        tagId: string;
    }

    interface RoomMemory {

    }

    interface SourceMemory {
        id: string;
        isBeingHarvested: boolean;
    }

    interface SpawnMemory {

    }
       
    interface ControllerMemory {
        id: string;
        containerId: string;
    }

    interface FlagMemory {
        colonyData?: ColonyFlagMemory;
        playbackData?: PlaybackFlagMemory;
    }

    interface ColonyFlagMemory {
        name: string;
        plan: string;
    }

    interface PlaybackFlagMemory {
        pauseOnException: boolean;

        doOutput: boolean;
        outputColor: string;

        playbackState: string;
        lastPlaybackState: string;        
    }

    /** END SCREEPS OBJECTS **/

    /** MANAGEMENT UNITS **/

    interface EmpireMemory {
        
    }

    interface ColonyMemory {
        id: string; // room name of the colony's nest
        name: string;
        nestId: string; // id of the nest
        planId: string;
        harvestBlockIds: string[];
    }

    interface NestMemory {
        id: string;
    }

    /**  END MANAGEMENT UNITS **/

    /** MAPS **/

    interface MapMemory {
        id: string;
        height: number;
        width: number;
        terrain: LayerMemory;
        roads: LayerMemory;
        structures: LayerMemory;
        ramparts: LayerMemory;
        special: LayerMemory
    }

    interface MapBlockMemory {
        id: string;
        height: number;
        width: number;
        offsetX: number;
        offsetY: number;
        roads: LayerMemory;
        structures: LayerMemory;
        ramparts: LayerMemory;
        special: LayerMemory
    }

    export interface LayerMemory {
        height: number;
        width: number;
        array: any[][];
    }

    /** END MAPS **/

    /** OPERATIONS **/

    interface ColonyOperationMemory {
        id: string;
        name: string;
        initialized: boolean;
        started: boolean;
        finished: boolean;
        assignedNames: string[];
    }

    interface OperationGroupMemory {
        newOps: string[];
        initializedOps: string[];
        runningOps: string[];
        completedOps: string[];
        id: string;
    }

    interface ColonyPlanMemory {
        id: string;
        name: string;
        milestoneIndex: number;
        currentOps: string;
    }

    /** END OPERATIONS **/

    /** MISC / UNUSED **/

    interface SpawnDefinitionMemory {
        id: string;
        name: string;
        roleId: string;
        minEnergy: number;
        maxEnergy: number;
    }

    /** END MISC / UNUSED **/

    /** TESTS **/

    interface MemTestMemory {
        boolA: boolean;
        boolB: boolean;
        boolC: boolean;
        intA: number;
        intB: number;
        intC: number;
        stringA: string;
        stringB: string;
        stringC: string;
        stringArrayA: string[];
        stringArrayB: string[];
    }

    /** END TESTS **/
}
