import { Execute } from "./imp/Execution";

declare global {
    interface CreepMemory {
        body: string;
        operation: string;
        homeSpawnId: string;        
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
        id: string; //todo: remove
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
