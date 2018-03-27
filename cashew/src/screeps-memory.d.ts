import { Execute } from "./imp/Execution";

declare global {
    interface CreepMemory {
        body: string;
        operation: string;
        homeSpawnId: string;        
        birthTick: number;
        deathTick: number;
    }

    interface FlagMemory {
        colonyData?: ColonyFlagMemory;
        playbackData?: PlaybackFlagMemory;
        flagOperation?: FlagOperationMemory;
        flagCampaign?: FlagCampaignMemory;
    }    
}
