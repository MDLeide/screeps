import { Execute } from "./imp/Execution";

declare global {
    interface CreepMemory {
        body: string;
        operation: string;
        homeSpawnId: string;        
        birthTick: number;
        deathTick: number;
        _move?: CreepMoveMemory;
    }

    interface CreepMoveMemory {
        dest: RoomPositionMemory;
        time: number;
        path: string;
        room: string;
    }

    interface RoomPositionMemory {
        x: number;
        y: number;
        room: string;
    }

    interface FlagMemory {
        colonyData?: ColonyFlagMemory;
        playbackData?: PlaybackFlagMemory;
        flagOperation?: FlagOperationMemory;
        flagCampaign?: FlagCampaignMemory;
    }    
}
