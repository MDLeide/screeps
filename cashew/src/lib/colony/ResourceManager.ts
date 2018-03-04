import { Colony } from "./Colony";

export class ResourceManager {
    public static fromMemory(memory: ResourceManagerMemory, colony: Colony): ResourceManager {
        let manager = new this(colony);

        manager.sourceAId = memory.sourceAId;
        manager.sourceBId = memory.sourceBId;
        
        manager.settings = ResourceManagerSettings.fromMemory(memory.settings);
        manager.structures = Structures.fromMemory(memory.structures);
        
        return manager;
    }


    constructor(colony: Colony) {
        this.colony = colony;
        this.transfers = new Transfers(this);
        this.withdraws = new Withdraws(this);
    }


    public colony: Colony;

    public settings: ResourceManagerSettings;
    public transfers: Transfers;
    public withdraws: Withdraws;
    public structures: Structures;
    
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

    public update(): void { }

    public execute(): void { }

    public cleanup(): void { }


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
            sourceAId: this.sourceAId,
            sourceBId: this.sourceBId
        };
    }
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
