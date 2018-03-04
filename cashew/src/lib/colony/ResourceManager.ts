import { Colony } from "./Colony";

export class ResourceManager {
    public static fromMemory(memory: ResourceManagerMemory, colony: Colony): ResourceManager {
        let manager = new this(colony);

        manager.sourceAId = memory.sourceAId;
        manager.sourceBId = memory.sourceBId;
        
        manager.settings = ResourceManagerSettings.fromMemory(memory.settings);
        manager.structures = Structures.fromMemory(memory.structures);
        manager.ledger = Ledger.fromMemory(memory.ledger);
        
        return manager;
    }


    constructor(colony: Colony) {
        this.colony = colony;
        this.settings = new ResourceManagerSettings();
        this.transfers = new Transfers(this);
        this.withdraws = new Withdraws(this);
        this.structures = new Structures();
        this.ledger = new Ledger();
    }


    public colony: Colony;

    public settings: ResourceManagerSettings;
    public transfers: Transfers;
    public withdraws: Withdraws;
    public structures: Structures;
    public ledger: Ledger;
    
    public sourceAId: string;
    public sourceBId: string;
    

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
        if (this.structures.sourceAContainerOrLinkId)
            this.structures.sourceAContainerOrLink = Game.getObjectById<(StructureContainer | StructureLink)>(this.structures.sourceAContainerOrLinkId);

        if (this.structures.sourceBContainerOrLinkId)
            this.structures.sourceBContainerOrLink = Game.getObjectById<(StructureContainer | StructureLink)>(this.structures.sourceBContainerOrLinkId);

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


    public updateSourceContainerOrLink(sourceId: string, containerOrLink: (string | StructureContainer | StructureLink)): void {
        if (containerOrLink instanceof StructureContainer || containerOrLink instanceof StructureLink) {
            if (this.sourceAId == sourceId) {
                this.structures.sourceAContainerOrLinkId = containerOrLink.id;
                this.structures.sourceAContainerOrLink = containerOrLink;
            } else if (this.sourceBId == sourceId) {
                this.structures.sourceBContainerOrLinkId = containerOrLink.id;
                this.structures.sourceBContainerOrLink = containerOrLink;
            }
        } else {
            this.updateSourceContainerOrLink(sourceId, Game.getObjectById<(StructureContainer | StructureLink)>(containerOrLink));
        }
    }

    
    public save(): ResourceManagerMemory {
        return {
            settings: this.settings.save(),
            structures: this.structures.save(),
            ledger: this.ledger.save(),
            sourceAId: this.sourceAId,
            sourceBId: this.sourceBId
        };
    }
}

export class Ledger {
    public static fromMemory(memory: ResourceManagerLedgerMemory): Ledger {
        let ledger = new this();
        ledger.lastTick = memory.lastTick as LedgerPeriod;
        ledger.currentGeneration = memory.currentGeneration as LedgerPeriod;
        ledger.lastGeneration = memory.lastGeneration as LedgerPeriod;
        ledger.history = memory.history as LedgerPeriod[];
        ledger.tickOffset = memory.tickOffset;
        return ledger;
    }


    constructor() {
        this.thisTick = new LedgerPeriod();
        this.lastTick = new LedgerPeriod();
        this.currentGeneration = new LedgerPeriod();
        this.currentGeneration.startTick = Game.time;
        this.currentGeneration.ticks = 0;
        this.lastGeneration = new LedgerPeriod();
        this.history = [];
        this.tickOffset = Game.time % 1500 - 1;
        if (this.tickOffset < 0)
            this.tickOffset = 1499;
    }


    public thisTick: LedgerPeriod;
    public lastTick: LedgerPeriod;
    public currentGeneration: LedgerPeriod;
    public lastGeneration: LedgerPeriod;
    public history: LedgerPeriod[];
    public historyMaxLength = 5;
    public tickOffset: number;


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

        this.currentGeneration.netEnergy += this.thisTick.netEnergy;
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


    public registerHarvest(energy: number): void {
        this.thisTick.harvestEnergy += energy;
        this.thisTick.netEnergy += energy;
    }

    public registerRemoteHarvest(energy: number): void {
        this.thisTick.remoteHarvestEnergy += energy;
        this.thisTick.netEnergy += energy;
    }

    public registerEmpireIncoming(energy: number): void {
        this.thisTick.empireIncomingEnergy += energy;
        this.thisTick.netEnergy += energy;
    }

    public registerMarketBuy(energy: number): void {
        this.thisTick.marketBuyEnergy += energy;
        this.thisTick.netEnergy += energy;
    }


    public registerSpawn(energy: number): void {
        this.thisTick.spawnEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerUpgrade(energy: number): void {
        this.thisTick.upgradeEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerBuild(energy: number): void {
        this.thisTick.buildEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerRepair(energy: number): void {
        this.thisTick.repairEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerEmpireOutgoing(energy: number): void {
        this.thisTick.empireOutgoingEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerMarketSell(energy: number): void {
        this.thisTick.marketSellEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerTerminalTransferCost(energy: number): void {
        this.thisTick.terminalTransferEnergy += energy;
        this.thisTick.netEnergy -= energy;
    }

    public registerLinkTransferCost(energy: number): void {
        this.thisTick.linkTransferEnergy += energy;
        this.thisTick.netEnergy -= energy;
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
    
    public spawnEnergy: number = 0;
    public upgradeEnergy: number = 0;
    public buildEnergy: number = 0;
    public repairEnergy: number = 0;
    public empireOutgoingEnergy: number = 0;
    public marketSellEnergy: number = 0;
    public terminalTransferEnergy: number = 0;
    public linkTransferEnergy: number = 0;

    public netEnergy: number = 0;
}

class Structures {
    public static fromMemory(memory: ResourceManagerStructureMemory): Structures {
        let structures = new this();

        structures.sourceAContainerOrLinkId = memory.sourceAContainerOrLinkId;
        structures.sourceBContainerOrLinkId = memory.sourceBContainerOrLinkId;

        structures.controllerContainerId = memory.controllerContainerId;

        structures.extensionLinkId = memory.extensionLinkId;
        structures.storageLinkId = memory.storageLinkId;
        structures.controllerLinkId = memory.controllerLinkId;

        return structures;
    }

    public sourceAContainerOrLinkId: string;
    public sourceAContainerOrLink: (StructureContainer | StructureLink);

    public sourceBContainerOrLinkId: string;
    public sourceBContainerOrLink: (StructureContainer | StructureLink);

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
            sourceAContainerOrLinkId: this.sourceAContainerOrLinkId,
            sourceBContainerOrLinkId: this.sourceBContainerOrLinkId
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
        var container = this.getContainerWithdrawTarget(creep);
        if (container)
            return container;

        if (this.resourceManager.colony.nest.room.storage && this.resourceManager.colony.nest.room.storage.store.energy > this.resourceManager.settings.storageWithdrawThreshold)
            return this.resourceManager.colony.nest.room.storage;

        return null;
    }

    private getContainerWithdrawTarget(creep: Creep): StructureContainer {
        let overflow: StructureContainer[] = [];
        let containers: StructureContainer[] = [];

        if (this.resourceManager.structures.sourceAContainerOrLink && this.resourceManager.structures.sourceAContainerOrLink instanceof StructureContainer) {
            if (this.resourceManager.structures.sourceAContainerOrLink.store.energy > this.resourceManager.settings.sourceContainerWithdrawThreshold) {
                if (this.resourceManager.structures.sourceAContainerOrLink.store.energy > this.resourceManager.settings.sourceContainerOverflowThreshold)
                    overflow.push(this.resourceManager.structures.sourceAContainerOrLink);
                else
                    containers.push(this.resourceManager.structures.sourceAContainerOrLink);
            }
        }

        if (this.resourceManager.structures.sourceBContainerOrLink && this.resourceManager.structures.sourceBContainerOrLink instanceof StructureContainer) {
            if (this.resourceManager.structures.sourceBContainerOrLink.store.energy > this.resourceManager.settings.sourceContainerWithdrawThreshold) {
                if (this.resourceManager.structures.sourceBContainerOrLink.store.energy > this.resourceManager.settings.sourceContainerOverflowThreshold)
                    overflow.push(this.resourceManager.structures.sourceBContainerOrLink);
                else
                    containers.push(this.resourceManager.structures.sourceBContainerOrLink);
            }
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
        TransferPriorityTarget.Terminal,
        TransferPriorityTarget.Storage
    ];

    public storageWithdrawThreshold: number = 100;
    public sourceContainerWithdrawThreshold: number = 50;

    public sourceContainerOverflowThreshold: number = 1600;

    public controllerLinkTransferThreshold: number = 400;
    public extensionLinkTransferThreshold: number = 500;

    public controllerContainerMaxEnergy: number = 1800;
    public storageMaxEnergy: number = 1000000;
    public labMaxEnergy: number = 200000;
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
