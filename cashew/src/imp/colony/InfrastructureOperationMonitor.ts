import { ColonyMonitor } from "lib/colony/ColonyMonitor";
import { Colony } from "lib/colony/Colony";
import { HarvestInfrastructureOperation } from "../operation/infrastructure/HarvestInfrastructureOperation";
import { ExtensionConstructionOperation } from "../operation/infrastructure/ExtensionsOperation";
import { WallConstructionOperation } from "../operation/infrastructure/WallConstructionOperation";
import { ControllerInfrastructureOperation } from "../operation/infrastructure/ControllerInfrastructureOperation";
import { TowerConstructionOperation } from "../operation/infrastructure/TowerConstructionOperation";
import { StorageConstructionOperation } from "../operation/infrastructure/StorageConstructionOperation";
import { HarvestLinkConstructionOperation } from "../operation/infrastructure/HarvestLinkConstructionOperation";
import { UpgradeLinkConstructionOperation } from "../operation/infrastructure/UpgradeLinkConstruction";
import { ExtensionLinkConstructionOperation } from "../operation/infrastructure/ExtensionLinkConstruction";
import { ExtractorConstructionOperation } from "../operation/infrastructure/ExtractorConstructionOperation";
import { TerminalConstructionOperation } from "../operation/infrastructure/TerminalConstructionOperation";
import { LabConstructionOperation } from "../operation/infrastructure/LabConstructionOperation";
import { SpawnConstructionOperation } from "../operation/infrastructure/SpawnConstructionOperation";
import { ObserverConstructionOperation } from "../operation/infrastructure/ObserverConstructionOperation";
import { StorageLinkConstructionOperation } from "../operation/infrastructure/StorageLinkConstructionOperation";
import { ReplaceOriginalSpawnOperation } from "../operation/infrastructure/ReplaceOriginalSpawnOperation";

export class InfrastructureOperationMonitor extends ColonyMonitor {
    public static fromMemory(memory: MonitorMemory): InfrastructureOperationMonitor {
        let monitor = new this();
        return ColonyMonitor.fromMemory(memory, monitor) as InfrastructureOperationMonitor;
    }

    constructor() {
        super(MONITOR_INFRASTRUCTURE_OPERATION)
    }

    public load(): void {
    }

    public update(context: Colony): void {
    }

    public execute(context: Colony): void {        
        this.checkInfrastructure(context);
    }

    public cleanup(context: Colony): void {
    }

    private checkInfrastructure(colony: Colony): void {
        this.levelOne(colony);
        if (colony.nest.room.controller.level >= 2)
            this.levelTwo(colony);
        if (colony.nest.room.controller.level >= 3)
            this.levelThree(colony);
        if (colony.nest.room.controller.level >= 4)
            this.levelFour(colony);
        if (colony.nest.room.controller.level >= 5)
            this.levelFive(colony);
        if (colony.nest.room.controller.level >= 6)
            this.levelSix(colony);
        if (colony.nest.room.controller.level >= 7)
            this.levelSeven(colony);
        if (colony.nest.room.controller.level >= 8)
            this.levelEight(colony);
    }

    private levelOne(colony: Colony): void {
        if (!colony.resourceManager.structures.sourceAContainer) { // need source container            
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_INFRASTRUCTURE,
                1,
                () => new HarvestInfrastructureOperation(colony.resourceManager.sourceAId),
                (op: HarvestInfrastructureOperation) => op.sourceId == colony.resourceManager.sourceAId);
        }

        if (colony.resourceManager.sourceBId) { // second source
            if (!colony.resourceManager.structures.sourceBContainer) {
                this.ensureOperation(
                    colony,
                    OPERATION_HARVEST_INFRASTRUCTURE,
                    1,
                    () => new HarvestInfrastructureOperation(colony.resourceManager.sourceBId),
                    (op: HarvestInfrastructureOperation) => op.sourceId == colony.resourceManager.sourceBId);
            }
        }
    }

    private levelTwo(colony: Colony): void {
        this.ensureOperation(
            colony,
            OPERATION_WALL_CONSTRUCTION,
            1,
            () => new WallConstructionOperation());

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 5) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(2));
            return;
        }

        if (!colony.resourceManager.structures.controllerContainer) {
            this.ensureOperation(
                colony,
                OPERATION_CONTROLLER_INFRASTRUCTURE,
                1,
                () => new ControllerInfrastructureOperation());
        }
    }

    private levelThree(colony: Colony): void {
        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 1) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(3));
            return;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 10)
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(3));                    
    }

    private levelFour(colony: Colony): void {
        if (!colony.nest.room.storage) {
            this.ensureOperation(
                colony,
                OPERATION_STORAGE_CONSTRUCTION,
                1,
                () => new StorageConstructionOperation());
            return;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 20)
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(4));
    }

    private levelFive(colony: Colony): void {
        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 2) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(5));
            return;
        }

        if (!colony.resourceManager.structures.sourceALink)
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_LINK_CONSTRUCTION,
                1,
                () => new HarvestLinkConstructionOperation(colony.resourceManager.sourceAId));

        if (!colony.resourceManager.structures.controllerLink) {
            this.ensureOperation(
                colony,
                OPERATION_UPGRADE_LINK_CONSTRUCTION,
                1,
                () => new UpgradeLinkConstructionOperation());
            return;
        }
            
        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 30)
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(5));
    }

    private levelSix(colony: Colony): void {
        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 40) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(6));
            return;
        }

        if (!colony.resourceManager.structures.extensionLink) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_LINK_CONSTRUCTION,
                1,
                () => new ExtensionLinkConstructionOperation());
            return;
        }

        let extractorCount = this.countMyStructures(colony, STRUCTURE_EXTRACTOR);
        if (extractorCount < 1) {
            this.ensureOperation(
                colony,
                OPERATION_EXTRACTOR_CONSTRUCTION,
                1,
                () => new ExtractorConstructionOperation());
            return;
        }

        if (!colony.nest.room.terminal) {
            this.ensureOperation(
                colony,
                OPERATION_TERMINAL_CONSTRUCTION,
                1,
                () => new TerminalConstructionOperation());
            return;
        }

        let labCount = this.countMyStructures(colony, STRUCTURE_LAB);
        if (labCount < 3) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(6));
        }
    }

    private levelSeven(colony: Colony): void {
        let spawnCount = this.countMyStructures(colony, STRUCTURE_SPAWN);
        if (spawnCount < 2) {
            this.ensureOperation(
                colony,
                OPERATION_SPAWN_CONSTRUCTION,
                1,
                () => new SpawnConstructionOperation(7));
            return;
        }

        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 3) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(7));
            return;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 50) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(7));
            return;
        }

        if (colony.resourceManager.sourceBId && !colony.resourceManager.structures.sourceBLink) {
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_LINK_CONSTRUCTION,
                1,
                () => new HarvestLinkConstructionOperation(colony.resourceManager.sourceBId));
            return;
        }

        let labCount = this.countMyStructures(colony, STRUCTURE_LAB);
        if (labCount < 6) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(7));
        }
    }

    private levelEight(colony: Colony): void {
        let spawnCount = this.countMyStructures(colony, STRUCTURE_SPAWN);
        if (spawnCount < 3) {
            this.ensureOperation(
                colony,
                OPERATION_SPAWN_CONSTRUCTION,
                1,
                () => new SpawnConstructionOperation(8));
            return;
        }

        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 6) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(8));
            return;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 60) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(8));
            return;
        }

        if (!colony.resourceManager.structures.storageLink) {
            this.ensureOperation(
                colony,
                OPERATION_STORAGE_LINK_CONSTRUCTION,
                1,
                () => new StorageLinkConstructionOperation());
            return;
        }

        let observerCount = this.countMyStructures(colony, STRUCTURE_OBSERVER);
        if (observerCount < 1) {
            this.ensureOperation(
                colony,
                OPERATION_OBSERVER_CONSTRUCTION,
                1,
                () => new ObserverConstructionOperation());
            return;
        }

        let labCount = this.countMyStructures(colony, STRUCTURE_LAB);
        if (labCount < 10) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(8));
            return;
        }

        if (this.originalSpawnNeedsMoving(colony)) {
            this.ensureOperation(
                colony,
                OPERATION_REPLACE_ORIGINAL_SPAWN,
                1,
                () => new ReplaceOriginalSpawnOperation());
        }
    }

    private originalSpawnNeedsMoving(colony: Colony): boolean {
        if (!this.spawnExists(colony, colony.nest.nestMap.mainBlock.getSpawnLocation(1)))
            return true;
        if (!this.spawnExists(colony, colony.nest.nestMap.mainBlock.getSpawnLocation(7)))
            return true;
        if (!this.spawnExists(colony, colony.nest.nestMap.mainBlock.getSpawnLocation(8)))
            return true;
        return false;        
    }

    private spawnExists(colony: Colony, loc: { x: number, y: number }): boolean {
        let look = colony.nest.room.lookForAt(LOOK_STRUCTURES, loc.x, loc.y);
        for (var i = 0; i < look.length; i++)
            if (look[i].structureType == STRUCTURE_SPAWN)
                return true;
        return false;
    }

    private countMyStructures(colony: Colony, type: StructureConstant): number {
        return colony.nest.room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == type }).length;
    }
}
