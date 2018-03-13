export class Stats {
    public static updateStats(): void {        
        this.initialize();

        this.updateColonies();
        this.updateEmpire();
        this.updateCpu();
    }

    private static initialize(): void {
        Memory.stats = {
            cpu: {
                bucket: undefined,
                used: undefined,
                tickLimit: undefined
            },
            colonies:[],
            energy: {
                harvested: undefined,
                remotedHarvested: undefined,
                empireIncoming: undefined,
                marketBuy: undefined,
                totalRevenue: undefined,
                spawnEnergy: undefined,
                upgradeEnergy: undefined,
                buildEnergy: undefined,
                repairEnergy: undefined,
                empireOutgoingEnergy: undefined,
                marketSellEnergy: undefined,
                terminalTransferEnergy: undefined,
                linkTransferEnergy: undefined,
                towerEnergy: undefined,
                totalExpenses: undefined,
                netEnergy: undefined,
            },
            creeps: {
                spawning: undefined,
                alive: undefined
            }
        };
    }

    private static updateCpu(): void {
        Memory.stats.cpu.bucket = Game.cpu.bucket;
        Memory.stats.cpu.tickLimit = Game.cpu.tickLimit;
        Memory.stats.cpu.used = Game.cpu.getUsed();
    }

    private static updateColonies(): void {
        for (var i = 0; i < global.empire.colonies.length; i++) {
            let colony = global.empire.colonies[i];

            let creepMem: CreepStatsMemory = {
                alive: colony.population.alive.length,
                spawning: colony.population.spawning.length
            };

            let energyMem: EnergyStatsMemory = {
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
            }

            let colonyMem: ColonyStatsMemory = {
                energy: energyMem,
                creeps: creepMem
            };

            Memory.stats.colonies.push(colonyMem);
        }
    }

    private static updateEmpire(): void {
        let spawning = 0;
        let alive = 0;

        let harvested: number = 0;
        let remotedHarvested: number = 0;
        let empireIncoming: number = 0;
        let marketBuy: number = 0;
        let totalRevenue: number = 0;

        let spawnEnergy: number = 0;
        let upgradeEnergy: number = 0;
        let buildEnergy: number = 0;
        let repairEnergy: number = 0;
        let empireOutgoingEnergy: number = 0;
        let marketSellEnergy: number = 0;
        let terminalTransferEnergy: number = 0;
        let linkTransferEnergy: number = 0;
        let towerEnergy: number = 0;
        let totalExpenses: number = 0;

        let netEnergy: number = 0;

        for (var i = 0; i < Memory.stats.colonies.length; i++) {
            let c = Memory.stats.colonies[i];

            spawning += c.creeps.spawning;
            alive += c.creeps.alive;

            harvested += c.energy.harvested;
            remotedHarvested += c.energy.remotedHarvested;
            empireIncoming += c.energy.empireIncoming;
            marketBuy += c.energy.marketBuy;
            totalRevenue += c.energy.totalRevenue;

            spawnEnergy += c.energy.spawnEnergy;
            upgradeEnergy += c.energy.upgradeEnergy;
            buildEnergy += c.energy.buildEnergy;
            repairEnergy += c.energy.repairEnergy;
            empireOutgoingEnergy += c.energy.empireOutgoingEnergy;
            marketSellEnergy += c.energy.marketSellEnergy;
            terminalTransferEnergy += c.energy.terminalTransferEnergy;
            linkTransferEnergy += c.energy.linkTransferEnergy;
            towerEnergy += c.energy.towerEnergy;
            totalExpenses += c.energy.totalExpenses;

            netEnergy += c.energy.netEnergy;
        }

        Memory.stats.creeps.alive = alive;
        Memory.stats.creeps.spawning = spawning;

        Memory.stats.energy.harvested = harvested;
        Memory.stats.energy.remotedHarvested = remotedHarvested;
        Memory.stats.energy.empireIncoming = empireIncoming;
        Memory.stats.energy.marketBuy = marketBuy;
        Memory.stats.energy.totalRevenue = totalRevenue;

        Memory.stats.energy.spawnEnergy = spawnEnergy;
        Memory.stats.energy.upgradeEnergy = upgradeEnergy;
        Memory.stats.energy.buildEnergy = buildEnergy;
        Memory.stats.energy.repairEnergy = repairEnergy;
        Memory.stats.energy.empireOutgoingEnergy = empireOutgoingEnergy;
        Memory.stats.energy.marketSellEnergy = marketSellEnergy;
        Memory.stats.energy.terminalTransferEnergy = terminalTransferEnergy;
        Memory.stats.energy.linkTransferEnergy = linkTransferEnergy;
        Memory.stats.energy.towerEnergy = towerEnergy;
        Memory.stats.energy.totalExpenses = totalExpenses;

        Memory.stats.energy.netEnergy = netEnergy;
    }
}
