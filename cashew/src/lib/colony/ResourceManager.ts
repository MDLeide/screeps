import { Colony } from "./Colony";

export class ResourceManager {
    public static fromMemory(memory: ResourceManagerMemory, colony: Colony): ResourceManager {
        let manager = new this(colony);
        manager.sourceContainerIds = memory.sourceContainerIds;
        manager.controllerContainerId = memory.controllerContainerId;
        manager.fillPriority = memory.transferPriority;
        return manager;
    }

    //todo: memory for these properties. code is fine right now.
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

    /** If a storage has less than this much energy, it will be ignored in withdraw requests. */
    public storageWithdrawThreshold: number = 100;
    /** If a source container has less than this much energy, it will be ignored in withdraw requests. */
    public sourceContainerWithdrawThreshold: number = 50;

    /** If a source container has more than this much energy, it will be prioritized as a withdraw target. */
    public sourceContainerOverflowThreshold: number = 1600;
        
    /** If the upgrade container has more than this much energy, transfers will be temporarily suspended. */
    public upgradeContainerMaxEnergy: number = 1800;    
    /** If the storage has more than this much energy, transfers will be temporarily suspended. */
    public storageMaxEnergy: number = 1000000;
    /** If a lab has more than this much energy, transfers will be temporarily suspended. */
    public labMaxEnergy: number = 200000;
    /** If a tower has more than this much energy, transfers will be temporarily suspended. */
    public towerMaxEnergy: number = 1000;
    /** If the terminal has more than this much energy, transfers will be temporarily suspended. */
    public terminalMaxEnergy: number = 200000;
    /** If the nuker has more than this much energy, transfers will be temporarily suspended. */
    public nukerMaxEnergy: number = 200000;

    public sourceContainerIds: string[] = [];
    public sourceContainers: StructureContainer[] = [];
    public controllerContainerId: string;
    public controllerContainer: StructureContainer;

    public load(): void {
        this.sourceContainers = [];
        for (var i = 0; i < this.sourceContainerIds.length; i++) {
            this.sourceContainers.push(Game.getObjectById<StructureContainer>(this.sourceContainerIds[i]));
        }
            
        if (this.controllerContainerId)
            this.controllerContainer = Game.getObjectById<StructureContainer>(this.controllerContainerId);
    }

    public update(): void { }

    public execute(): void { }

    public cleanup(): void { }

    public addSourceContainer(container: (string | StructureContainer)): void {
        if (container instanceof StructureContainer) {
            this.sourceContainerIds.push(container.id);
            this.sourceContainers.push(container);
        } else {
            this.addSourceContainer(Game.getObjectById<StructureContainer>(container));
        }
    }

    public setControllerContainer(container: (string | StructureContainer)): void {
        if (container instanceof StructureContainer) {
            this.controllerContainer = container;
            this.controllerContainerId = container.id;
        } else {
            this.setControllerContainer(Game.getObjectById<StructureContainer>(container));
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


    public save(): ResourceManagerMemory {
        return {
            sourceContainerIds: this.sourceContainerIds,
            controllerContainerId: this.controllerContainerId,
            transferPriority: this.fillPriority
        };
    }


    private getContainerWithdrawTarget(creep: Creep): StructureContainer {
        let overflow: StructureContainer[] = [];
        let containers: StructureContainer[] = [];

        for (var i = 0; i < this.sourceContainers.length; i++) {
            if (this.sourceContainers[i].store.energy > this.sourceContainerWithdrawThreshold) {
                if (this.sourceContainers[i].store.energy > this.sourceContainerOverflowThreshold)
                    overflow.push(this.sourceContainers[i]);
                else
                    containers.push(this.sourceContainers[i]);
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
        if (this.controllerContainer)
            if (this.controllerContainer.store.energy < this.upgradeContainerMaxEnergy)
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
