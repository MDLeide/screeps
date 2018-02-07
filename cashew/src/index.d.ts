import { IRoleState } from "./lib/creep/role/state/IRoleState";

import { CreepNut } from "./imp/extend/nut/CreepNut";
import { RoomNut } from "./imp/extend/nut/RoomNut";
import { SourceNut } from "./imp/extend/nut/SourceNut";
import { SpawnNut } from "./imp/extend/nut/SpawnNut";
import { ContainerNut } from "./imp/extend/nut/ContainerNut";
import { ControllerNut } from "./imp/extend/nut/ControllerNut";

import { TowerController } from "./imp/tower/TowerController";


declare global {
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




    interface Memory {
        containers: { [containerId: string]: ContainerMemory };
        controllers: { [controllerId: string]: ControllerMemory };
        sources: { [sourceId: string]: SourceMemory };

        colonies: { [colonyId: string]: ColonyMemory };
        nests: { [nestId: string]: NestMemory };
        plans: { [planId: string]: ColonyPlanMemory };
        operations: { [operationId: string]: ColonyOperationMemory };
    }




    interface CreepMemory {
        roleId: string;
        role: IRoleState | null;
        homeSpawnId: string;
        spawnDefId: string;
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

    interface QueenMemory {

    }

    interface ControllerMemory {
        id: string;
        containerId: string;
    }

    interface EmpireMemory {

    }

    interface NestMemory {
        id: string;        
    }

    interface ColonyMemory {
        id: string;
        name: string;
        nestId: string;
        planId: string;
    }

    interface ColonyPlanMemory {
        id: string;
        name: string;
        milestoneIndex: number;
        operationsThisMilestone: string[];
        operationsLastMilestone: string[];
        initializedOps: string[];
        runningOps: string[];
    }

    interface ColonyOperationMemory {
        id: string;
        name: string;
        initialized: boolean;
        started: boolean;
        finished: boolean;
        spawnDefinitionIds: string[];
        assignedIds: string[];
    }

    interface SpawnDefinitionMemory {
        id: string;
        name: string;
        roleId: string;
        minEnergy: number;
        maxEnergy: number;
    }
}
