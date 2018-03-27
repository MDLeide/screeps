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
        if (!colony.nest.spawners || !colony.nest.spawners.length)
            return;

        if (this.levelOne(colony))
            return;
        if (colony.nest.room.controller.level >= 2)
            if (this.levelTwo(colony))
                return;
        if (colony.nest.room.controller.level >= 3)
            if (this.levelThree(colony))
                return;
        if (colony.nest.room.controller.level >= 4)
            if (this.levelFour(colony))
                return;
        if (colony.nest.room.controller.level >= 5)
            if (this.levelFive(colony))
                return;
        if (colony.nest.room.controller.level >= 6)
            if (this.levelSix(colony))
                return;
        if (colony.nest.room.controller.level >= 7)
            if (this.levelSeven(colony))
                return;
        if (colony.nest.room.controller.level >= 8)
            if (this.levelEight(colony))
                return;
    }

    private levelOne(colony: Colony): boolean {
        let opStarted = false;
        if (!colony.resourceManager.structures.sourceAContainer) { // need source container            
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_INFRASTRUCTURE,
                1,
                () => new HarvestInfrastructureOperation(colony.resourceManager.sourceAId),
                (op: HarvestInfrastructureOperation) => op.sourceId == colony.resourceManager.sourceAId);
            opStarted = true;
        }

        if (colony.resourceManager.sourceBId) { // second source
            if (!colony.resourceManager.structures.sourceBContainer) {
                this.ensureOperation(
                    colony,
                    OPERATION_HARVEST_INFRASTRUCTURE,
                    1,
                    () => new HarvestInfrastructureOperation(colony.resourceManager.sourceBId),
                    (op: HarvestInfrastructureOperation) => op.sourceId == colony.resourceManager.sourceBId);
                opStarted = true;
            }
        }
        return opStarted;
    }

    private levelTwo(colony: Colony): boolean {
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
            return true;
        }

        if (!colony.resourceManager.structures.controllerContainer) {
            this.ensureOperation(
                colony,
                OPERATION_CONTROLLER_INFRASTRUCTURE,
                1,
                () => new ControllerInfrastructureOperation());
            return true;
        }
        return false;
    }

    private levelThree(colony: Colony): boolean {
        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 1) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(3));
            return true;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 10) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(3));
            return true;
        }
        return false;
    }

    private levelFour(colony: Colony): boolean {
        if (!colony.nest.room.storage) {
            this.ensureOperation(
                colony,
                OPERATION_STORAGE_CONSTRUCTION,
                1,
                () => new StorageConstructionOperation());
            return true;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 20) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(4));
            return true;
        }
        return false;
    }

    private levelFive(colony: Colony): boolean {
        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 2) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(5));
            return true;
        }

        if (!colony.resourceManager.structures.sourceALink) {
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_LINK_CONSTRUCTION,
                1,
                () => new HarvestLinkConstructionOperation(colony.resourceManager.sourceAId));
            return true;
        }

        if (!colony.resourceManager.structures.controllerLink) {
            this.ensureOperation(
                colony,
                OPERATION_UPGRADE_LINK_CONSTRUCTION,
                1,
                () => new UpgradeLinkConstructionOperation());
            return true;
        }
            
        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 30) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(5));
            return true;
        }
        return false;
    }

    private levelSix(colony: Colony): boolean {
        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 40) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(6));
            return true;
        }

        if (!colony.resourceManager.structures.extensionLink) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_LINK_CONSTRUCTION,
                1,
                () => new ExtensionLinkConstructionOperation());
            return true;
        }

        let extractorCount = this.countMyStructures(colony, STRUCTURE_EXTRACTOR);
        if (extractorCount < 1) {
            this.ensureOperation(
                colony,
                OPERATION_EXTRACTOR_CONSTRUCTION,
                1,
                () => new ExtractorConstructionOperation());
            return true;
        }

        if (!colony.nest.room.terminal) {
            this.ensureOperation(
                colony,
                OPERATION_TERMINAL_CONSTRUCTION,
                1,
                () => new TerminalConstructionOperation());
            return true;
        }

        let labCount = this.countMyStructures(colony, STRUCTURE_LAB);
        if (labCount < 3) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(6));
            return true;
        }

        return false;
    }

    private levelSeven(colony: Colony): boolean {
        let spawnCount = this.countMyStructures(colony, STRUCTURE_SPAWN);
        if (spawnCount < 2) {
            this.ensureOperation(
                colony,
                OPERATION_SPAWN_CONSTRUCTION,
                1,
                () => new SpawnConstructionOperation(7));
            return true;
        }

        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 3) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(7));
            return true;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 50) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(7));
            return true;
        }

        if (colony.resourceManager.sourceBId && !colony.resourceManager.structures.sourceBLink) {
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_LINK_CONSTRUCTION,
                1,
                () => new HarvestLinkConstructionOperation(colony.resourceManager.sourceBId));
            return true;
        }

        let labCount = this.countMyStructures(colony, STRUCTURE_LAB);
        if (labCount < 6) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(7));
            return true;
        }
        return false;
    }

    private levelEight(colony: Colony): boolean {
        let spawnCount = this.countMyStructures(colony, STRUCTURE_SPAWN);
        if (spawnCount < 3) {
            this.ensureOperation(
                colony,
                OPERATION_SPAWN_CONSTRUCTION,
                1,
                () => new SpawnConstructionOperation(8));
            return true;
        }

        let towerCount = this.countMyStructures(colony, STRUCTURE_TOWER);
        if (towerCount < 6) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(8));
            return true;
        }

        let extensionCount = this.countMyStructures(colony, STRUCTURE_EXTENSION);
        if (extensionCount < 60) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(8));
            return true;
        }

        if (!colony.resourceManager.structures.storageLink) {
            this.ensureOperation(
                colony,
                OPERATION_STORAGE_LINK_CONSTRUCTION,
                1,
                () => new StorageLinkConstructionOperation());
            return true;
        }

        let observerCount = this.countMyStructures(colony, STRUCTURE_OBSERVER);
        if (observerCount < 1) {
            this.ensureOperation(
                colony,
                OPERATION_OBSERVER_CONSTRUCTION,
                1,
                () => new ObserverConstructionOperation());
            return true;
        }

        let labCount = this.countMyStructures(colony, STRUCTURE_LAB);
        if (labCount < 10) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(8));
            return true;
        }

        if (this.originalSpawnNeedsMoving(colony)) {
            this.ensureOperation(
                colony,
                OPERATION_REPLACE_ORIGINAL_SPAWN,
                1,
                () => new ReplaceOriginalSpawnOperation());
            return true;
        }
        return false;
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
