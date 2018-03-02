import { Colony } from "./Colony";

export class ResourceManager {
    public static fromMemory(memory: ResourceManagerMemory, colony: Colony): ResourceManager {
        let manager = new this(colony);

        manager.extensionLinkId = memory.extensionLinkId;
        manager.storageLinkId = memory.storageLinkId;
        manager.controllerLinkId = memory.controllerLinkId;

        manager.fillPriority = memory.transferPriority;

        manager.sourceAId = memory.sourceAId;
        manager.sourceBId = memory.sourceBId;

        manager.sourceAContainerOrLinkId = memory.sourceAContainerOrLinkId;
        manager.sourceBContainerOrLinkId = memory.sourceBContainerOrLinkId;
        return manager;
    }


    constructor(colony: Colony) {
        this.colony = colony;
    }


    public colony: Colony;

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

    public controllerContainerMaxEnergy: number = 1800;    
    public storageMaxEnergy: number = 1000000;    
    public labMaxEnergy: number = 200000;    
    public towerMaxEnergy: number = 1000;    
    public terminalMaxEnergy: number = 200000;    
    public nukerMaxEnergy: number = 200000;

    public sourceAId: string;
    public sourceBId: string;
    public sourceAContainerOrLinkId: string;
    public sourceBContainerOrLinkId: string;

    public sourceAContainerOrLink: (StructureContainer | StructureLink);
    public sourceBContainerOrLink: (StructureContainer | StructureLink);

    public controllerContainerId: string;
    public controllerContainer: StructureContainer;


    public controllerLinkId: string;
    public controllerLink: StructureLink;

    public extensionLinkId: string;
    public extensionLink: StructureLink;

    public storageLinkId:string;
    public storageLink: StructureLink;


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
        if (this.sourceAContainerOrLinkId)
            this.sourceAContainerOrLink = Game.getObjectById<(StructureContainer | StructureLink)>(this.sourceAContainerOrLinkId);

        if (this.sourceBContainerOrLinkId)
            this.sourceBContainerOrLink = Game.getObjectById<(StructureContainer | StructureLink)>(this.sourceBContainerOrLinkId);

        if (this.controllerContainerId)
            this.controllerContainer = Game.getObjectById<StructureContainer>(this.controllerContainerId);


        if (this.controllerLinkId)
            this.controllerLink = Game.getObjectById<StructureLink>(this.controllerLinkId);

        if (this.extensionLinkId)
            this.extensionLink = Game.getObjectById<StructureLink>(this.extensionLinkId);

        if (this.storageLinkId)
            this.storageLink = Game.getObjectById<StructureLink>(this.storageLinkId);
    }

    public update(): void { }

    public execute(): void { }

    public cleanup(): void { }


    public updateSourceContainerOrLink(sourceId: string, containerOrLink: (string | StructureContainer | StructureLink)): void {
        if (containerOrLink instanceof StructureContainer || containerOrLink instanceof StructureLink) {
            if (this.sourceAId == sourceId) {
                this.sourceAContainerOrLinkId = containerOrLink.id;
                this.sourceAContainerOrLink = containerOrLink;
            } else if (this.sourceBId == sourceId) {
                this.sourceBContainerOrLinkId = containerOrLink.id;
                this.sourceBContainerOrLink = containerOrLink;
            }
        } else {
            this.updateSourceContainerOrLink(sourceId, Game.getObjectById<(StructureContainer | StructureLink)>(containerOrLink));
        }
    }


    public getWithdrawTarget(creep: Creep): WithdrawTarget {
        var container = this.getContainerWithdrawTarget(creep);
        if (container)
            return container;

        if (this.colony.nest.room.storage && this.colony.nest.room.storage.store.energy > this.storageWithdrawThreshold)
            return this.colony.nest.room.storage;

        return null;       
    }
       
    public getTransferTarget(creep: Creep): TransferTarget {
        for (var i = 0; i < this.fillPriority.length; i++) {
            let target = this.getTarget(creep, this.fillPriority[i]);
            if (target)
                return target;
        }
        return null;
    }
    
    public getSpawnExtensionTransferTargets(creep: Creep): (StructureSpawn | StructureExtension) {
        for (var i = 0; i < this.colony.nest.spawners.length; i++)
            if (this.colony.nest.spawners[i].spawn.energy < this.colony.nest.spawners[i].spawn.energyCapacity)
                return this.colony.nest.spawners[i].spawn;

        let closest = creep.pos.findClosestByRange<StructureExtension>(FIND_MY_STRUCTURES,
            {
                filter: (ext) => {
                    return ext.structureType == STRUCTURE_EXTENSION && ext.energy < ext.energyCapacity;
                }
            });
        return closest;
    }

    public getLinkTransferTarget(): StructureLink {
        if (this.extensionLink && this.extensionLink.energy < this.extensionLink.energyCapacity)
            return this.extensionLink;
        else if (this.controllerLink instanceof StructureLink && this.controllerLink.energy < this.controllerLink.energyCapacity)
            return this.controllerLink;
        return null;
    }


    private getContainerWithdrawTarget(creep: Creep): StructureContainer {
        let overflow: StructureContainer[] = [];
        let containers: StructureContainer[] = [];
        
        if (this.sourceAContainerOrLink && this.sourceAContainerOrLink instanceof StructureContainer) {
            if (this.sourceAContainerOrLink.store.energy > this.sourceContainerWithdrawThreshold) {
                if (this.sourceAContainerOrLink.store.energy > this.sourceContainerOverflowThreshold)
                    overflow.push(this.sourceAContainerOrLink);
                else
                    containers.push(this.sourceAContainerOrLink);
            }
        }

        if (this.sourceBContainerOrLink && this.sourceBContainerOrLink instanceof StructureContainer) {
            if (this.sourceBContainerOrLink.store.energy > this.sourceContainerWithdrawThreshold) {
                if (this.sourceBContainerOrLink.store.energy > this.sourceContainerOverflowThreshold)
                    overflow.push(this.sourceBContainerOrLink);
                else
                    containers.push(this.sourceBContainerOrLink);
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

    private getTarget(creep: Creep, target: TransferPriorityTarget) : TransferTarget {
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
                    return tower.structureType == STRUCTURE_TOWER && tower.energy < this.towerMaxEnergy;
                }
            });
    }

    private getControllerTransferTarget(creep: Creep): StructureContainer {
        if (this.controllerContainer && this.controllerContainer.store.energy < this.controllerContainerMaxEnergy)
            return this.controllerContainer;
        return null;
    }

    private getStorageTransferTarget(creep: Creep): StructureStorage {
        if (this.colony.nest.room.storage
            && this.colony.nest.room.storage.store.energy < this.storageMaxEnergy
            && _.sum(this.colony.nest.room.storage.store) < this.colony.nest.room.storage.storeCapacity)
            return this.colony.nest.room.storage;

        return null;
    }

    private getTerminalTransferTarget(creep: Creep): StructureTerminal {
        if (this.colony.nest.room.terminal
            && this.colony.nest.room.terminal.store.energy < this.terminalMaxEnergy
            && _.sum(this.colony.nest.room.terminal.store) < this.colony.nest.room.terminal.storeCapacity)
            return this.colony.nest.room.terminal;

        return null;
    }

    private getNukerTransferTarget(creep: Creep): StructureNuker {
        throw Error("nuker transfer not implemented");
    }

    private getLabTransferTarget(creep: Creep): StructureLab {
        return creep.pos.findClosestByRange<StructureLab>(FIND_MY_STRUCTURES, {
            filter: (lab) => {
                return lab.structureType == STRUCTURE_LAB && lab.energy < this.labMaxEnergy;
            }
        });
    }


    public save(): ResourceManagerMemory {
        return {
            controllerLinkId: this.controllerLinkId,
            extensionLinkId: this.extensionLinkId,
            storageLinkId: this.storageLinkId,
            controllerContainerId: this.controllerContainerId,
            transferPriority: this.fillPriority,
            sourceAId: this.sourceAId,
            sourceBId: this.sourceBId,
            sourceAContainerOrLinkId: this.sourceAContainerOrLinkId,
            sourceBContainerOrLinkId: this.sourceBContainerOrLinkId
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
