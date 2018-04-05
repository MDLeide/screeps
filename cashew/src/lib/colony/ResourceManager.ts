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
        this.structures.load();
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


    public getResourceCount(): { [resource: string]: number } {
        let resources: { [resource: string]: number } = {};
        if (this.colony.nest.room.storage)
            this.sumStore(resources, this.colony.nest.room.storage);

        if (this.colony.nest.room.terminal)
            this.sumStore(resources, this.colony.nest.room.terminal);

        for (var i = 0; i < this.structures.storageContainers.length; i++)
            this.sumStore(resources, this.structures.storageContainers[i]);

        return resources;
    }

    /** Gets the target to use when dropping off energy for a demand order. */
    public getDropoffTarget(resource: ResourceConstant): TransferTarget {
        return this.colony.nest.room.storage;
    }

    /** Gets the target to use when picking up energy for a supply order. */
    public getPickupTarget(resource: ResourceConstant): WithdrawTarget {
        return this.colony.nest.room.storage;
    }

    /** Finds dropped energy. */
    public getEnergyPickupTarget(creep: Creep): Resource<RESOURCE_ENERGY> {
        let look = this.colony.nest.room.find(FIND_DROPPED_RESOURCES, { filter: (r) => r.resourceType == RESOURCE_ENERGY && r.amount > 75 });

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

    /** Gets the highest priority target that requires energy. */
    public getTransferTarget(creep: Creep): TransferTarget {
        return this.transfers.getTransferTarget(creep);
    }

    /** Gets a Spawn or Extension that requires energy. */
    public getSpawnExtensionTransferTargets(creep: Creep): (StructureSpawn | StructureExtension) {
        return this.transfers.getSpawnExtensionTransferTargets(creep);
    }

    /** Gets the currently prefered energy provider. */
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

    public addStorageContainer(container: string | StructureContainer): void {
        if (typeof (container) == "string")
            return this.addStorageContainer(Game.getObjectById<StructureContainer>(container));
        if (!container)
            return;
        this.structures.storageContainerIds.push(container.id);
        this.structures.storageContainers.push(container);
    }

    private sumStore(resourceCount: { [resource: string]: number }, structure: { store: StoreDefinition }): { [resource: string]: number } {
        for (let key in structure.store) {
            if (resourceCount[key])
                resourceCount[key] += structure.store[key];
            else
                resourceCount[key] = structure.store[key];
        }
        return resourceCount;
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

        structures.sourceAContainerId = memory.sourceAContainerId;
        structures.sourceALinkId = memory.sourceALinkId;        
        structures.sourceBContainerId = memory.sourceBContainerId;
        structures.sourceBLinkId = memory.sourceBLinkId;        
        structures.controllerContainerId = memory.controllerContainerId;
        structures.controllerLinkId = memory.controllerLinkId;
        structures.extensionLinkId = memory.extensionLinkId;
        structures.storageLinkId = memory.storageLinkId;
        structures.storageContainerIds = memory.storageContainerIds[];

        return structures;
    }
    
    public constructor(resourceManager: ResourceManager) {
        this.resourceManager = resourceManager;
    }
    
    public resourceManager: ResourceManager;

    public sourceAContainerId: string;
    public sourceALinkId: string;
    public sourceBContainerId: string;
    public sourceBLinkId: string;
    public controllerContainerId: string;
    public controllerLinkId: string;
    public extensionLinkId: string;
    public storageLinkId: string;
    public storageContainerIds: string[] = [];

    public sourceAContainer: StructureContainer;
    public sourceALink: StructureLink;
    public sourceBContainer: StructureContainer;
    public sourceBLink: StructureLink;    
    public controllerContainer: StructureContainer;
    public controllerLink: StructureLink;    
    public extensionLink: StructureLink;    
    public storageLink: StructureLink;
    public storageContainers: StructureContainer[] = [];

    public load(): void {
        if (this.sourceAContainerId)
            this.sourceAContainer = Game.getObjectById<StructureContainer>(this.sourceAContainerId);
        if (this.sourceALinkId)
            this.sourceALink = Game.getObjectById<StructureLink>(this.sourceALinkId);
        if (this.sourceBContainerId)
            this.sourceBContainer = Game.getObjectById<StructureContainer>(this.sourceBContainerId);
        if (this.sourceBLinkId)
            this.sourceBLink = Game.getObjectById<StructureLink>(this.sourceBLinkId);
        
        if (this.controllerContainerId)
            this.controllerContainer = Game.getObjectById<StructureContainer>(this.controllerContainerId);        
        if (this.controllerLinkId)
            this.controllerLink = Game.getObjectById<StructureLink>(this.controllerLinkId);

        if (this.extensionLinkId)
            this.extensionLink = Game.getObjectById<StructureLink>(this.extensionLinkId);

        if (this.storageLinkId)
            this.storageLink = Game.getObjectById<StructureLink>(this.storageLinkId);
        for (var i = 0; i < this.storageContainerIds.length; i++) {
            let container = Game.getObjectById<StructureContainer>(this.storageContainerIds[i]);
            if (container)
                this.storageContainers.push(container);
        }            
    }

    public getInputLinks(): StructureLink[] {
        let links = [];
        if (this.sourceALink)
            links.push(this.sourceALink);
        if (this.sourceBLink)
            links.push(this.sourceBLink);
        return links;
    }

    public getOutputLinks(): StructureLink[] {
        let links = [];
        if (this.controllerLink)
            links.push(this.controllerLink);
        if (this.extensionLink)
            links.push(this.extensionLink);
        if (this.storageLink)
            links.push(this.storageLink);
        return links;
    }

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

    private getStorageContainerIds(): string[] {
        return this.storageContainers.map(p => p.id);
    }

    public save(): ResourceManagerStructureMemory {
        return {
            controllerLinkId: this.controllerLink ? this.controllerLink.id : undefined,
            extensionLinkId: this.extensionLink ? this.extensionLink.id : undefined,
            storageLinkId: this.storageLink ? this.storageLink.id : undefined,
            controllerContainerId: this.controllerContainer ? this.controllerContainer.id : undefined,
            sourceAContainerId: this.sourceAContainer ? this.sourceAContainer.id : undefined,
            sourceALinkId: this.sourceALink ? this.sourceALink.id : undefined,
            sourceBContainerId: this.sourceBContainer ? this.sourceBContainer.id : undefined,
            sourceBLinkId: this.sourceBLink ? this.sourceBLink.id : undefined,
            storageContainerIds: this.getStorageContainerIds()
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

    private getTarget(creep: Creep, target: TransferPriorityTarget): TransferTarget {
        switch (target) {
            case TransferPriorityTarget.SpawnsAndExtensions:
                return this.getSpawnExtensionTransferTargets(creep);
            case TransferPriorityTarget.Towers:
                return this.getTowerTransferTarget(creep);
            case TransferPriorityTarget.Links:
                return this.getLinkTransferTarget(creep);
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

    public getSpawnExtensionTransferTargets(creep: Creep): (StructureSpawn | StructureExtension) {
        let managed = this.resourceManager.extensionsManagedDirectly;
        let closest = creep.pos.findClosestByRange<StructureExtension | StructureSpawn>(FIND_MY_STRUCTURES,
            {
                filter: (struct) => {
                    return ((!managed && struct.structureType == STRUCTURE_EXTENSION) || struct.structureType == STRUCTURE_SPAWN) && struct.energy < struct.energyCapacity;
                }
            });
        return closest;
    }

    private getLinkTransferTarget(creep: Creep): StructureLink {
        if (this.resourceManager.structures.storageLink && this.resourceManager.structures.storageLink.energy < this.resourceManager.settings.linkTransferThreshold)
            return this.resourceManager.structures.storageLink;
        if (this.resourceManager.structures.controllerLink && this.resourceManager.structures.controllerLink.energy < this.resourceManager.settings.linkTransferThreshold)
            return this.resourceManager.structures.controllerLink;
        return null;
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

        if (this.resourceManager.colony.nest.room.storage &&
            this.resourceManager.colony.nest.room.storage.store.energy > this.resourceManager.settings.storageWithdrawThreshold)
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
        let distance: number = 1000000;

        if (overflow.length) {
            container = overflow[0];
            distance = creep.pos.getRangeTo(overflow[0]);
            for (var i = 0; i < overflow.length; i++) {
                var d = creep.pos.getRangeTo(overflow[i]);
                if (d < distance) {
                    distance = d;
                    container = overflow[i];
                }
            }
        } else if (containers.length) {
            container = containers[0];
            distance = creep.pos.getRangeTo(containers[0]);
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
        TransferPriorityTarget.Links,
        TransferPriorityTarget.Towers,
        TransferPriorityTarget.Controller,
        TransferPriorityTarget.Lab,        
        TransferPriorityTarget.Storage,
        TransferPriorityTarget.Terminal
    ];

    // WITHDRAWS

    /** Minimum amount of energy required to withdraw from storage. */
    public storageWithdrawThreshold: number = 100;
    /** Minimum amount of energy required to withdraw from source container. */
    public sourceContainerWithdrawThreshold: number = 500;
    /** Amount of energy required for a source container to be considered overflowing. */
    public sourceContainerOverflowThreshold: number = 1600;

    // TRANSFERS

    /** Minimum amount of energy required for a link to execute a transfer. */
    public linkTransferThreshold: number = 600;
    /** Maximum amount of energy allowed in controller container before disallowing transfers. */
    public controllerContainerMaxEnergy: number = 1800;
    /** Maximum amount of energy allowed in storage before disallowing transfers. */
    public storageMaxEnergy: number = 1000000;
    /** Maximum amount of energy allowed in a lab before disallowing transfers. */
    public labMaxEnergy: number = 2000;
    /** Maximum amount of energy allowed in a tower before disallowing transfers. */
    public towerMaxEnergy: number = 1000;
    /** Maximum amount of energy allowed in the terminal before disallowing transfers. */
    public terminalMaxEnergy: number = 200000;
    /** Maximum amount of energy allowed in the nuker before disallowing transfers. */
    public nukerMaxEnergy: number = 200000;
    
    public save(): ResourceManagerSettingsMemory {
        return {
            transferPriority: this.fillPriority
        };
    }
}

export enum TransferPriorityTarget {
    SpawnsAndExtensions, //0
    Towers, // 1
    Controller, // 2
    Storage, // 3
    Terminal, // 4
    Nuker, // 5
    Lab, // 6
    Links //7
}
