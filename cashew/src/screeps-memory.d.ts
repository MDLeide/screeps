import { IRoleState } from "./lib/creep/role/state/IRoleState";

declare global {
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
}
