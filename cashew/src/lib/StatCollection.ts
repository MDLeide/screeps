import { Colony } from "./colony/Colony";
import { Empire } from "./empire/Empire";

export class StatCollection {
    public static updateStats(): void {        
        let stats = this.getEmpireStats(global.empire);
        global.stats.addSimpleStat("empire", stats);
    }


    private static getEmpireStats(empire: Empire): EmpireStats {
        return {
            energy: this.getEmpireEnergyStats(empire),
            creeps: this.getEmpireCreepStats(empire),
            colonies: this.getAllColonyStats(empire.colonies)
        };
    }
    
    private static getAllColonyStats(colonies: Colony[]): { [name: string]: ColonyStats } {
        let c: { [name: string]: ColonyStats } = {};
        for (var i = 0; i < colonies.length; i++)
            c[colonies[i].name] = this.getColonyStats(colonies[i]);
        return c;
    }

    private static getColonyStats(colony: Colony): ColonyStats {
        return {
            energy: this.getColonyEnergyStats(colony),
            creeps: this.getColonyCreepsStats(colony)
        };
    }

    private static getColonyEnergyStats(colony: Colony): EnergyStats {
        return {
            harvested: colony.resourceManager.ledger.thisTick.harvestEnergy,
            remotedHarvested: colony.resourceManager.ledger.thisTick.remoteHarvestEnergy,
            empireIncoming: colony.resourceManager.ledger.thisTick.empireIncomingEnergy,
            marketBuy: colony.resourceManager.ledger.thisTick.marketBuyEnergy,
            totalRevenue: colony.resourceManager.ledger.thisTick.totalRevenue,
            spawnEnergy: colony.resourceManager.ledger.thisTick.spawnEnergy,
            upgradeEnergy: colony.resourceManager.ledger.thisTick.upgradeEnergy,
            buildEnergy: colony.resourceManager.ledger.thisTick.buildEnergy,
            repairEnergy: colony.resourceManager.ledger.thisTick.repairEnergy,
            empireOutgoingEnergy: colony.resourceManager.ledger.thisTick.empireOutgoingEnergy,
            marketSellEnergy: colony.resourceManager.ledger.thisTick.marketSellEnergy,
            terminalTransferEnergy: colony.resourceManager.ledger.thisTick.terminalTransferEnergy,
            linkTransferEnergy: colony.resourceManager.ledger.thisTick.linkTransferEnergy,
            towerEnergy: colony.resourceManager.ledger.thisTick.towerEnergy,
            totalExpenses: colony.resourceManager.ledger.thisTick.totalExpenses,
            netEnergy: colony.resourceManager.ledger.thisTick.netEnergy
        };
    }

    private static getColonyCreepsStats(colony: Colony): CreepStats {
        return {
            alive: colony.population.alive.length,
            spawning: colony.population.spawning.length
        };
    }

    private static getEmpireCreepStats(empire: Empire): CreepStats {
        let creeps: CreepStats = {
            spawning: 0,
            alive: 0
        };

        for (var i = 0; i < empire.colonies.length; i++) {
            let c = empire.colonies[i];
            if (c.population.spawning)
                creeps.spawning += c.population.spawning.length;
            if (c.population.alive)
                creeps.alive += c.population.alive.length;
        }

        return creeps;
    }

    private static getEmpireEnergyStats(empire: Empire): EnergyStats {        
        let energy: EnergyStats = {
            harvested: 0,
            remotedHarvested: 0,
            empireIncoming: 0,
            marketBuy: 0,
            totalRevenue: 0,
            spawnEnergy: 0,
            upgradeEnergy: 0,
            buildEnergy: 0,
            repairEnergy: 0,
            empireOutgoingEnergy: 0,
            marketSellEnergy: 0,
            terminalTransferEnergy: 0,
            linkTransferEnergy: 0,
            towerEnergy: 0,
            totalExpenses: 0,
            netEnergy: 0
        };
                
        for (var i = 0; i < empire.colonies.length; i++) {
            let c = empire.colonies[i];

            energy.harvested += c.resourceManager.ledger.thisTick.harvestEnergy;
            energy.remotedHarvested += c.resourceManager.ledger.thisTick.remoteHarvestEnergy;
            energy.empireIncoming += c.resourceManager.ledger.thisTick.empireIncomingEnergy;
            energy.marketBuy += c.resourceManager.ledger.thisTick.marketBuyEnergy;
            energy.totalRevenue += c.resourceManager.ledger.thisTick.totalRevenue;

            energy.spawnEnergy += c.resourceManager.ledger.thisTick.spawnEnergy;
            energy.upgradeEnergy += c.resourceManager.ledger.thisTick.upgradeEnergy;
            energy.buildEnergy += c.resourceManager.ledger.thisTick.buildEnergy;
            energy.repairEnergy += c.resourceManager.ledger.thisTick.repairEnergy;
            energy.empireOutgoingEnergy += c.resourceManager.ledger.thisTick.empireOutgoingEnergy;
            energy.marketSellEnergy += c.resourceManager.ledger.thisTick.marketSellEnergy;
            energy.terminalTransferEnergy += c.resourceManager.ledger.thisTick.terminalTransferEnergy;
            energy.linkTransferEnergy += c.resourceManager.ledger.thisTick.linkTransferEnergy;
            energy.towerEnergy += c.resourceManager.ledger.thisTick.towerEnergy;
            energy.totalExpenses += c.resourceManager.ledger.thisTick.totalExpenses;

            energy.netEnergy += c.resourceManager.ledger.thisTick.netEnergy;
        }

        return energy;
    }
}

interface EmpireStats {
    creeps: CreepStats,
    energy: EnergyStats,
    colonies: { [id: string]: ColonyStats }
}

interface ColonyStats {
    creeps: CreepStats,
    energy: EnergyStats
}

interface CreepStats {
    alive: number,
    spawning: number
}

interface EnergyStats {
    harvested: number,
    remotedHarvested: number,
    empireIncoming: number,
    marketBuy: number,
    totalRevenue: number,
    spawnEnergy: number,
    upgradeEnergy: number,
    buildEnergy: number,
    repairEnergy: number,
    empireOutgoingEnergy: number,
    marketSellEnergy: number,
    terminalTransferEnergy: number,
    linkTransferEnergy: number,
    towerEnergy: number,
    totalExpenses: number,
    netEnergy: number
}
