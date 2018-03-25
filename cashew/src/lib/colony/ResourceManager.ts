import { Colony } from "./Colony";

export class ResourceManager {
    public static fromMemory(memory: ResourceManagerMemory, colony: Colony): ResourceManager {
        let manager = new this(colony);

        manager.sourceAId = memory.sourceAId;
        manager.sourceBId = memory.sourceBId;
        
        manager.settings = ResourceManagerSettings.fromMemory(memory.settings);
        manager.structures = Structures.fromMemory(memory.structures, manager);
        manager.ledger = Ledger.fromMemory(memory.ledger, manager);

        manager.extensionsManagedDirectly = memory.extensionsManagedDirectly;

        return manager;
    }


    constructor(colony: Colony) {
        this.colony = colony;
        this.settings = new ResourceManagerSettings();
        this.transfers = new Transfers(this);
        this.withdraws = new Withdraws(this);
        this.structures = new Structures(this);
        this.ledger = new Ledger(this);
        this.advisor = new Advisor(this);
    }


    public colony: Colony;

    public settings: ResourceManagerSettings;
    public transfers: Transfers;
    public withdraws: Withdraws;
    public structures: Structures;
    public ledger: Ledger;
    public advisor: Advisor;
    
    public sourceAId: string;
    public sourceBId: string;

    public extensionsManagedDirectly: boolean = false;

    /** Call once, after initial creation. */
    public initialize(): void {
        let sources = this.colony.nest.room.find(FIND_SOURCES);
        if (sources.length == 1) {
            this.sourceAId = sources[0].id;
        } else if (sources.length == 2) {
            this.sourceAId = sources[0].id;
            this.sourceBId = sources[1].id;
        }
    }


    public load(): void {
        if (this.structures.sourceAContainerId)
            this.structures.sourceAContainer = Game.getObjectById<StructureContainer>(this.structures.sourceAContainerId);

        if (this.structures.sourceALinkId)
            this.structures.sourceALink = Game.getObjectById<StructureLink>(this.structures.sourceALinkId);

        if (this.structures.sourceBContainerId)
            this.structures.sourceBContainer = Game.getObjectById<StructureContainer>(this.structures.sourceBContainerId);

        if (this.structures.sourceBLinkId)
            this.structures.sourceBLink = Game.getObjectById<StructureLink>(this.structures.sourceBLinkId);


        if (this.structures.controllerContainerId)
            this.structures.controllerContainer = Game.getObjectById<StructureContainer>(this.structures.controllerContainerId);


        if (this.structures.controllerLinkId)
            this.structures.controllerLink = Game.getObjectById<StructureLink>(this.structures.controllerLinkId);

        if (this.structures.extensionLinkId)
            this.structures.extensionLink = Game.getObjectById<StructureLink>(this.structures.extensionLinkId);

        if (this.structures.storageLinkId)
            this.structures.storageLink = Game.getObjectById<StructureLink>(this.structures.storageLinkId);
    }

    public update(): void {
        this.ledger.update();
    }

    public execute(): void {
        this.ledger.execute();
    }

    public cleanup(): void {
        this.ledger.cleanup();
    }


    public getEnergyPickupTarget(creep: Creep): Resource<RESOURCE_ENERGY> {
        let look = this.colony.nest.room.find(FIND_DROPPED_RESOURCES, { filter: (r) => r.resourceType == RESOURCE_ENERGY });

        let distance = 100;
        let resource: Resource<RESOURCE_ENERGY>;
        
        for (var i = 0; i < look.length; i++) {
            let d = look[i].pos.getRangeTo(creep);
            if (d < distance) {
                resource = look[i] as Resource<RESOURCE_ENERGY>;
                distance = d;
            }
        }

        return resource;
    }

    public getTransferTarget(creep: Creep): TransferTarget {
        return this.transfers.getTransferTarget(creep);
    }

    public getSpawnExtensionTransferTargets(creep: Creep): (StructureSpawn | StructureExtension) {
        return this.transfers.getSpawnExtensionTransferTargets(creep);
    }

    public getLinkTransferTarget(): StructureLink {
        return this.transfers.getLinkTransferTarget();
    }

    public getWithdrawTarget(creep: Creep): WithdrawTarget {
        return this.withdraws.getWithdrawTarget(creep);
    }
    
    public setSourceContainer(sourceId: string, container: (string | StructureContainer)): void {
        if (container instanceof StructureContainer) {
            if (this.sourceAId == sourceId) {
                this.structures.sourceAContainerId = container.id;
                this.structures.sourceAContainer= container;
            } else if (this.sourceBId == sourceId) {
                this.structures.sourceBContainerId = container.id;
                this.structures.sourceBContainer= container;
            }
        } else {
            this.setSourceContainer(sourceId, Game.getObjectById<StructureContainer>(container));
        }
    }

    public setSourceLink(sourceId: string, link: (string | StructureLink)): void {
        if (link instanceof StructureLink) {
            if (this.sourceAId == sourceId) {
                this.structures.sourceALinkId = link.id;
                this.structures.sourceALink = link;
            } else if (this.sourceBId == sourceId) {
                this.structures.sourceBLinkId = link.id;
                this.structures.sourceBLink = link;
            }
        } else {
            this.setSourceLink(sourceId, Game.getObjectById<StructureLink>(link));
        }
    }
    
    public save(): ResourceManagerMemory {
        return {
            settings: this.settings.save(),
            structures: this.structures.save(),
            ledger: this.ledger.save(),
            sourceAId: this.sourceAId,
            sourceBId: this.sourceBId,
            extensionsManagedDirectly: this.extensionsManagedDirectly
        };
    }
}

export class Advisor {
    constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }


    public resourceManager: ResourceManager;
    public reserveIncome: number = 0;


    public getUpgraderParts(): number {
        let averageAvailable = this.getAverageNetIncomePlusUpgrade() - this.reserveIncome;
        if (averageAvailable <= 0)
            return 0;
        let parts = Math.round(averageAvailable / 1500);
        if (parts > 15 && this.resourceManager.colony.nest.room.controller.level >= 8)
            return 15;
        return parts;
    }

    private getAverageNetIncomePlusUpgrade(): number {
        if (!this.resourceManager.ledger.lastGeneration)
            return this.resourceManager.ledger.currentGeneration.netEnergy + this.resourceManager.ledger.currentGeneration.upgradeEnergy;

        let count = 1;
        let sum = this.resourceManager.ledger.lastGeneration.netEnergy + this.resourceManager.ledger.lastGeneration.upgradeEnergy;

        for (var i = 0; i < this.resourceManager.ledger.history.length; i++) {
            count++;
            sum += this.resourceManager.ledger.history[i].netEnergy + this.resourceManager.ledger.history[i].upgradeEnergy;
        }

        return Math.round(sum / count);
    }
}

export class Ledger {
    public static fromMemory(memory: ResourceManagerLedgerMemory, resourceManager: ResourceManager): Ledger {
        let ledger = new this(resourceManager);
        ledger.lastTick = memory.lastTick as LedgerPeriod;
        ledger.currentGeneration = memory.currentGeneration as LedgerPeriod;
        ledger.lastGeneration = memory.lastGeneration ? memory.lastGeneration as LedgerPeriod : undefined;
        ledger.history = memory.history as LedgerPeriod[];
        ledger.tickOffset = memory.tickOffset;
        return ledger;
    }


    constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
        this.thisTick = new LedgerPeriod();
        this.lastTick = new LedgerPeriod();
        this.currentGeneration = new LedgerPeriod();
        this.currentGeneration.startTick = Game.time;
        this.currentGeneration.ticks = 0;
        this.history = [];
        this.tickOffset = Game.time % 1500 - 1;
        if (this.tickOffset < 0)
            this.tickOffset = 1499;
    }

    
    public resourceManager: ResourceManager;
    public thisTick: LedgerPeriod;
    public lastTick: LedgerPeriod;
    public currentGeneration: LedgerPeriod;
    public lastGeneration: LedgerPeriod;
    public history: LedgerPeriod[];
    public historyMaxLength = 5;
    public tickOffset: number;
    public sayOnRegistration: boolean = true;


    public update(): void {
        this.thisTick = new LedgerPeriod();
        this.thisTick.ticks = 1;
        this.thisTick.startTick = Game.time;
    }

    public execute(): void { }

    public cleanup(): void {
        this.currentGeneration.harvestEnergy += this.thisTick.harvestEnergy;
        this.currentGeneration.remoteHarvestEnergy += this.thisTick.remoteHarvestEnergy;
        this.currentGeneration.empireIncomingEnergy += this.thisTick.empireIncomingEnergy;
        this.currentGeneration.marketBuyEnergy += this.thisTick.marketBuyEnergy;

        this.currentGeneration.spawnEnergy += this.thisTick.spawnEnergy;
        this.currentGeneration.upgradeEnergy += this.thisTick.upgradeEnergy;
        this.currentGeneration.buildEnergy += this.thisTick.buildEnergy;
        this.currentGeneration.repairEnergy += this.thisTick.repairEnergy;
        this.currentGeneration.empireOutgoingEnergy += this.thisTick.empireOutgoingEnergy;
        this.currentGeneration.marketSellEnergy += this.thisTick.marketSellEnergy;
        this.currentGeneration.terminalTransferEnergy += this.thisTick.terminalTransferEnergy;
        this.currentGeneration.linkTransferEnergy += this.thisTick.linkTransferEnergy;
        this.currentGeneration.towerEnergy += this.thisTick.towerEnergy;

        this.currentGeneration.netEnergy += Math.round(this.thisTick.netEnergy);
        this.currentGeneration.totalRevenue += Math.round(this.thisTick.totalRevenue);
        this.currentGeneration.totalExpenses += Math.round(this.thisTick.totalExpenses);

        this.currentGeneration.ticks++;

        if (Game.time % 1500 == this.tickOffset) {            
            let temp = [];
            if (this.lastGeneration)
                temp.push(this.lastGeneration);
            for (var i = 0; i < this.historyMaxLength - 1 && i < this.history.length; i++)
                temp.push(this.history[i]);
            this.history = temp;
            this.lastGeneration = this.currentGeneration;
            this.currentGeneration = new LedgerPeriod();
            this.currentGeneration.ticks = 0;
            this.currentGeneration.startTick = Game.time;
        }
    }


    public reset(): void {
        this.history = [];
        this.currentGeneration = new LedgerPeriod();
        this.lastGeneration = undefined;
        this.lastTick = new LedgerPeriod();
        this.tickOffset = Game.time;        
    }


    public registerHarvest(creepOrEnergy: (Creep | number)): void {
        if (creepOrEnergy instanceof Creep) {
            let energy = creepOrEnergy.getActiveBodyparts(WORK) * HARVEST_POWER;
            if (this.sayOnRegistration)                
                creepOrEnergy.say(String.fromCodePoint(0x1F477) + " " + energy); // construction worker
            this.registerHarvest(energy);
            return;
        }
        
        this.thisTick.harvestEnergy += creepOrEnergy;
        this.thisTick.netEnergy += creepOrEnergy;
        this.thisTick.totalRevenue += creepOrEnergy;
    }

    public registerRemoteHarvest(creepOrEnergy: (Creep | number)): void {
        if (creepOrEnergy instanceof Creep) {
            let energy = creepOrEnergy.getActiveBodyparts(WORK) * HARVEST_POWER;
            if (this.sayOnRegistration)
                creepOrEnergy.say(String.fromCodePoint(0x1F477) + " " + energy); // construction worker
            this.registerRemoteHarvest(energy);
            return;
        }            

        this.thisTick.remoteHarvestEnergy += creepOrEnergy;
        this.thisTick.netEnergy += creepOrEnergy;
        this.thisTick.totalRevenue += creepOrEnergy;
    }

    public registerEmpireIncoming(energy: number): void {
        this.thisTick.empireIncomingEnergy += energy;
        this.thisTick.netEnergy += energy;
        this.thisTick.totalRevenue += energy;
    }

    public registerMarketBuy(energy: number): void {
        this.thisTick.marketBuyEnergy += energy;
        this.thisTick.netEnergy += energy;
        this.thisTick.totalRevenue += energy;
    }


    public registerSpawn(energy: number): void {
        this.thisTick.spawnEnergy += energy;
        this.thisTick.netEnergy -= energy;
        this.thisTick.totalExpenses += energy;
    }

    public registerUpgrade(creepOrEnergy: (Creep | number)): void {
        let energy = 0;
        if (creepOrEnergy instanceof Creep) {
            energy = Math.min(creepOrEnergy.carry.energy, creepOrEnergy.getActiveBodyparts(WORK) * UPGRADE_CONTROLLER_POWER);
            if (this.resourceManager.colony.nest.room.controller.level >= 8) {
                if (this.thisTick.upgradeEnergy >= 15)
                    return;
                energy = Math.min(15 - this.thisTick.upgradeEnergy, energy - this.thisTick.upgradeEnergy);
            }

            if (this.sayOnRegistration)
                creepOrEnergy.say(String.fromCodePoint(0x1F3E7) + " " + energy); // ATM
            this.registerUpgrade(energy);
            return;                
        }
                
        if (this.resourceManager.colony.nest.room.controller.level >= 8) {
            if (this.thisTick.upgradeEnergy >= 15)
                return;
            energy = Math.min(15 - this.thisTick.upgradeEnergy, creepOrEnergy - this.thisTick.upgradeEnergy);
            this.thisTick.upgradeEnergy += energy;
            this.thisTick.netEnergy -= energy;
            this.thisTick.totalExpenses += energy;
        } else {
            this.thisTick.upgradeEnergy += creepOrEnergy;
            this.thisTick.netEnergy -= creepOrEnergy;
            this.thisTick.totalExpenses += creepOrEnergy;
        }        
    }

    public registerBuild(creepOrEnergy: (Creep | number)): void {
        if (creepOrEnergy instanceof Creep) {
            let energy = Math.min(creepOrEnergy.carry.energy, creepOrEnergy.getActiveBodyparts(WORK) * BUILD_POWER);
            if (this.sayOnRegistration)
                creepOrEnergy.say(String.fromCodePoint(0x1F6A7) + " " + energy); // construction sign
            this.registerBuild(energy);
            return;                
        }
            

        this.thisTick.buildEnergy += creepOrEnergy;
        this.thisTick.netEnergy -= creepOrEnergy;
        this.thisTick.totalExpenses += creepOrEnergy;
    }

    public registerRepair(creepOrEnergy: (Creep | number)): void {
        if (creepOrEnergy instanceof Creep) {
            let energy = Math.min(creepOrEnergy.carry.energy, creepOrEnergy.getActiveBodyparts(WORK));
            if (this.sayOnRegistration)
                creepOrEnergy.say(String.fromCodePoint(0x1F6E0) + " " + energy); // hammer and wrench
            this.registerRepair(energy);
            return;
        }
            

        this.thisTick.repairEnergy += creepOrEnergy;
        this.thisTick.netEnergy -= creepOrEnergy;
        this.thisTick.totalExpenses += creepOrEnergy;
    }

    public registerEmpireOutgoing(energy: number): void {
        this.thisTick.empireOutgoingEnergy += energy;
        this.thisTick.netEnergy -= energy;
        this.thisTick.totalExpenses += energy;
    }

    public registerMarketSell(energy: number): void {
        this.thisTick.marketSellEnergy += energy;
        this.thisTick.netEnergy -= energy;
        this.thisTick.totalExpenses += energy;
    }

    public registerTerminalTransferCost(energy: number): void {
        this.thisTick.terminalTransferEnergy += energy;
        this.thisTick.netEnergy -= energy;
        this.thisTick.totalExpenses += energy;
    }

    public registerLinkTransferCost(energy: number): void {
        this.thisTick.linkTransferEnergy += Math.round(energy);
        this.thisTick.netEnergy -= energy;
        this.thisTick.totalExpenses += energy;
    }

    public registerTowerFire(energy: number): void {
        this.thisTick.towerEnergy += energy;
        this.thisTick.netEnergy -= energy;
        this.thisTick.totalExpenses += energy;
    }


    public save(): ResourceManagerLedgerMemory {
        return {
            lastTick: this.thisTick,
            currentGeneration: this.currentGeneration,
            lastGeneration: this.lastGeneration,
            history: this.history,
            historyMaxLength: this.historyMaxLength,
            tickOffset: this.tickOffset
        };
    }
}

export class LedgerPeriod {
    public startTick: number = 0;
    public ticks: number = 0;

    public harvestEnergy: number = 0;
    public remoteHarvestEnergy: number = 0;
    public empireIncomingEnergy: number = 0; // energy received from elsewhere in the empire
    public marketBuyEnergy: number = 0;
    public totalRevenue: number = 0;

    public spawnEnergy: number = 0;
    public upgradeEnergy: number = 0;
    public buildEnergy: number = 0;
    public repairEnergy: number = 0;
    public empireOutgoingEnergy: number = 0;
    public marketSellEnergy: number = 0;
    public terminalTransferEnergy: number = 0;
    public linkTransferEnergy: number = 0;
    public towerEnergy: number = 0;
    public totalExpenses: number = 0;

    public netEnergy: number = 0;
}

class Structures {
    public static fromMemory(memory: ResourceManagerStructureMemory, resourceManager: ResourceManager): Structures {
        let structures = new this(resourceManager);

        structures.sourceALinkId = memory.sourceALinkId;
        structures.sourceAContainerId = memory.sourceAContainerId;

        structures.sourceBLinkId = memory.sourceBLinkId;
        structures.sourceBContainerId = memory.sourceBContainerId;

        structures.controllerContainerId = memory.controllerContainerId;

        structures.extensionLinkId = memory.extensionLinkId;
        structures.storageLinkId = memory.storageLinkId;
        structures.controllerLinkId = memory.controllerLinkId;

        return structures;
    }


    public constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }


    public resourceManager: ResourceManager;


    public getSourceContainer(source: (string | Source)): StructureContainer {
        if (source instanceof Source) {
            return this.getSourceContainer(source.id);
        }
        if (this.resourceManager.sourceAId == source)
            return this.sourceAContainer;
        else if (this.resourceManager.sourceBId == source)
            return this.sourceBContainer;
        return null;
    }

    public getSourceLink(source: (string | Source)): StructureLink {
        if (source instanceof Source) {
            return this.getSourceLink(source.id);
        }
        if (this.resourceManager.sourceAId == source)
            return this.sourceALink;
        else if (this.resourceManager.sourceBId == source)
            return this.sourceBLink;
        return null;
    }

    public sourceAContainerId: string;
    public sourceAContainer: StructureContainer;

    public sourceALinkId: string;
    public sourceALink: StructureLink;

    public sourceBContainerId: string;
    public sourceBContainer: StructureContainer;

    public sourceBLinkId: string;
    public sourceBLink: StructureLink;
    
    public controllerContainerId: string;
    public controllerContainer: StructureContainer;

    public controllerLinkId: string;
    public controllerLink: StructureLink;

    public extensionLinkId: string;
    public extensionLink: StructureLink;

    public storageLinkId: string;
    public storageLink: StructureLink;


    public save(): ResourceManagerStructureMemory {
        return {            
            controllerLinkId: this.controllerLinkId,
            extensionLinkId: this.extensionLinkId,
            storageLinkId: this.storageLinkId,
            controllerContainerId: this.controllerContainerId,
            sourceAContainerId: this.sourceAContainerId,
            sourceALinkId: this.sourceALinkId,
            sourceBContainerId: this.sourceBContainerId,
            sourceBLinkId: this.sourceBLinkId
        };        
    }
}

class Transfers {
    constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }


    public resourceManager: ResourceManager;


    public getTransferTarget(creep: Creep): TransferTarget {
        for (var i = 0; i < this.resourceManager.settings.fillPriority.length; i++) {
            let target = this.getTarget(creep, this.resourceManager.settings.fillPriority[i]);
            if (target)
                return target;
        }
        return null;
    }

    public getSpawnExtensionTransferTargets(creep: Creep): (StructureSpawn | StructureExtension) {
        for (var i = 0; i < this.resourceManager.colony.nest.spawners.length; i++)
            if (this.resourceManager.colony.nest.spawners[i].spawn.energy < this.resourceManager.colony.nest.spawners[i].spawn.energyCapacity)
                return this.resourceManager.colony.nest.spawners[i].spawn;

        if (this.resourceManager.extensionsManagedDirectly)
            return null;

        let closest = creep.pos.findClosestByRange<StructureExtension>(FIND_MY_STRUCTURES,
            {
                filter: (ext) => {
                    return ext.structureType == STRUCTURE_EXTENSION && ext.energy < ext.energyCapacity;
                }
            });
        return closest;
    }

    public getLinkTransferTarget(): StructureLink {
        if (this.resourceManager.structures.extensionLink && this.resourceManager.structures.extensionLink.energy < this.resourceManager.settings.extensionLinkTransferThreshold)
            return this.resourceManager.structures.extensionLink;
        else if (this.resourceManager.structures.controllerLink && this.resourceManager.structures.controllerLink.energy < this.resourceManager.settings.controllerLinkTransferThreshold)
            return this.resourceManager.structures.controllerLink;
        else if (this.resourceManager.structures.storageLink && this.resourceManager.structures.storageLink.energy < this.resourceManager.settings.storageLinkTransferThreshold)
            return this.resourceManager.structures.storageLink;
        return null;
    }


    private getTarget(creep: Creep, target: TransferPriorityTarget): TransferTarget {
        switch (target) {
            case TransferPriorityTarget.SpawnsAndExtensions:
                return this.getSpawnExtensionTransferTargets(creep);
            case TransferPriorityTarget.Towers:
                return this.getTowerTransferTarget(creep);
            case TransferPriorityTarget.Controller:
                return this.getControllerTransferTarget(creep);
            case TransferPriorityTarget.Storage:
                return this.getStorageTransferTarget(creep);
            case TransferPriorityTarget.Terminal:
                return this.getTerminalTransferTarget(creep);
            case TransferPriorityTarget.Nuker:
                return this.getNukerTransferTarget(creep);
            case TransferPriorityTarget.Lab:
                return this.getLabTransferTarget(creep);
            default:
                return null;
        }
    }

    private getTowerTransferTarget(creep: Creep): StructureTower {
        return creep.pos.findClosestByRange<StructureTower>(FIND_MY_STRUCTURES,
            {
                filter: (tower) => {
                    return tower.structureType == STRUCTURE_TOWER && tower.energy < this.resourceManager.settings.towerMaxEnergy;
                }
            });
    }

    private getControllerTransferTarget(creep: Creep): StructureContainer {
        if (this.resourceManager.structures.controllerContainer && this.resourceManager.structures.controllerContainer.store.energy < this.resourceManager.settings.controllerContainerMaxEnergy)
            return this.resourceManager.structures.controllerContainer;
        return null;
    }

    private getStorageTransferTarget(creep: Creep): StructureStorage {
        if (this.resourceManager.colony.nest.room.storage
            && this.resourceManager.colony.nest.room.storage.store.energy < this.resourceManager.settings.storageMaxEnergy
            && _.sum(this.resourceManager.colony.nest.room.storage.store) < this.resourceManager.colony.nest.room.storage.storeCapacity)
            return this.resourceManager.colony.nest.room.storage;

        return null;
    }

    private getTerminalTransferTarget(creep: Creep): StructureTerminal {
        if (this.resourceManager.colony.nest.room.terminal
            && this.resourceManager.colony.nest.room.terminal.store.energy < this.resourceManager.settings.terminalMaxEnergy
            && _.sum(this.resourceManager.colony.nest.room.terminal.store) < this.resourceManager.colony.nest.room.terminal.storeCapacity)
            return this.resourceManager.colony.nest.room.terminal;

        return null;
    }

    private getNukerTransferTarget(creep: Creep): StructureNuker {
        throw Error("nuker transfer not implemented");
    }

    private getLabTransferTarget(creep: Creep): StructureLab {
        return creep.pos.findClosestByRange<StructureLab>(FIND_MY_STRUCTURES, {
            filter: (lab) => {
                return lab.structureType == STRUCTURE_LAB && lab.energy < this.resourceManager.settings.labMaxEnergy;
            }
        });
    }
}

class Withdraws {
    constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }


    public resourceManager: ResourceManager;


    public getWithdrawTarget(creep: Creep): WithdrawTarget {
        let tombstone = this.getTombstoneWithdrawTarget(creep);
        if (tombstone)
            return tombstone;

        var container = this.getContainerWithdrawTarget(creep);
        if (container)
            return container;

        if (this.resourceManager.colony.nest.room.storage && this.resourceManager.colony.nest.room.storage.store.energy > this.resourceManager.settings.storageWithdrawThreshold)
            return this.resourceManager.colony.nest.room.storage;

        return null;
    }

    private getTombstoneWithdrawTarget(creep: Creep): Tombstone {
        let tombstones = this.resourceManager.colony.nest.room.find(FIND_TOMBSTONES, { filter: (p) => p.store.energy > 0 });

        let distance = 100;
        let tombstone: Tombstone;

        for (var i = 0; i < tombstones.length; i++) {
            let d = creep.pos.getRangeTo(tombstones[i]);
            if (d < distance) {
                tombstone = tombstones[i];
                distance = d;
            }
        }

        return tombstone;
    }

    private getContainerWithdrawTarget(creep: Creep): StructureContainer {
        let overflow: StructureContainer[] = [];
        let containers: StructureContainer[] = [];

        if (this.resourceManager.structures.sourceAContainer && this.resourceManager.structures.sourceAContainer.store.energy > this.resourceManager.settings.sourceContainerWithdrawThreshold) {
            if (this.resourceManager.structures.sourceAContainer.store.energy > this.resourceManager.settings.sourceContainerOverflowThreshold)
                overflow.push(this.resourceManager.structures.sourceAContainer);
            else
                containers.push(this.resourceManager.structures.sourceAContainer);
        }


        if (this.resourceManager.structures.sourceBContainer && this.resourceManager.structures.sourceBContainer.store.energy > this.resourceManager.settings.sourceContainerWithdrawThreshold) {
            if (this.resourceManager.structures.sourceBContainer.store.energy > this.resourceManager.settings.sourceContainerOverflowThreshold)
                overflow.push(this.resourceManager.structures.sourceBContainer);
            else
                containers.push(this.resourceManager.structures.sourceBContainer);
        }
        
        let container: StructureContainer = null;
        let distance: number = 100;

        if (overflow.length) {
            for (var i = 0; i < overflow.length; i++) {
                var d = creep.pos.getRangeTo(overflow[i]);
                if (d < distance) {
                    distance = d;
                    container = overflow[i];
                }
            }
        } else {
            for (var i = 0; i < containers.length; i++) {
                var d = creep.pos.getRangeTo(containers[i]);
                if (d < distance) {
                    distance = d;
                    container = containers[i];
                }
            }
        }

        return container;
    }

}

class ResourceManagerSettings {
    public static fromMemory(memory: ResourceManagerSettingsMemory): ResourceManagerSettings {
        let settings = new this();
        settings.fillPriority = memory.transferPriority;
        return settings;
    }

    public fillPriority: TransferPriorityTarget[] = [
        TransferPriorityTarget.SpawnsAndExtensions,
        TransferPriorityTarget.Towers,
        TransferPriorityTarget.Controller,
        TransferPriorityTarget.Lab,        
        TransferPriorityTarget.Storage,
        TransferPriorityTarget.Terminal
    ];

    public storageWithdrawThreshold: number = 100;
    public sourceContainerWithdrawThreshold: number = 500;

    public sourceContainerOverflowThreshold: number = 1600;

    public controllerLinkTransferThreshold: number = 500;
    public extensionLinkTransferThreshold: number = 500;
    public storageLinkTransferThreshold: number = 500;

    public controllerContainerMaxEnergy: number = 1800;
    public storageMaxEnergy: number = 1000000;
    public labMaxEnergy: number = 2000;
    public towerMaxEnergy: number = 1000;
    public terminalMaxEnergy: number = 200000;
    public nukerMaxEnergy: number = 200000;

    public save(): ResourceManagerSettingsMemory {
        return {
            transferPriority: this.fillPriority
        };
    }
}

export enum TransferPriorityTarget {
    SpawnsAndExtensions,
    Towers,
    Controller,
    Storage,
    Terminal,
    Nuker,
    Lab
}
