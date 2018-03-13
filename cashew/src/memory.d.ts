import { Execute } from "./imp/Execution";

declare global {
    interface Memory {
        visuals: VisualsMemory;
        empire: EmpireMemory;
        stats: StatsMemory;
    }

    interface StatsMemory {
        cpu: CpuStatsMemory;
        colonies: ColonyStatsMemory[];
        energy: EnergyStatsMemory;
        creeps: CreepStatsMemory;
    }

    interface CpuStatsMemory {
        bucket: number;
        used: number;
        tickLimit: number;
    }

    interface ColonyStatsMemory {
        energy: EnergyStatsMemory;
        creeps: CreepStatsMemory;
    }

    interface EnergyStatsMemory {
        harvested: number;
        remotedHarvested: number;
        empireIncoming: number;
        marketBuy:number;
        totalRevenue: number;

        spawnEnergy: number;
        upgradeEnergy: number;
        buildEnergy: number;
        repairEnergy: number;
        empireOutgoingEnergy: number;
        marketSellEnergy: number;
        terminalTransferEnergy: number;
        linkTransferEnergy: number;
        towerEnergy: number;
        totalExpenses: number;

        netEnergy: number;
    }
    
    interface CreepStatsMemory {
        spawning: number;
        alive: number;
    }
}
