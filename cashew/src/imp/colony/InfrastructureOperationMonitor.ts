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
import { EffectiveRcl } from "lib/colony/EffectiveRcl";

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
        this.checkInfrastructure(context);
    }

    public execute(context: Colony): void {                
    }

    public cleanup(context: Colony): void {
    }

    private checkInfrastructure(colony: Colony): void {
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(1, 0))
            return;

        if (this.levelOne(colony))
            return;
        if (rcl.isGreaterThanOrEqualTo(2, 0))
            if (this.levelTwo(colony))
                return;
        if (rcl.isGreaterThanOrEqualTo(3, 0))
            if (this.levelThree(colony))
                return;
        if (rcl.isGreaterThanOrEqualTo(4, 0))
            if (this.levelFour(colony))
                return;
        if (rcl.isGreaterThanOrEqualTo(5, 0))
            if (this.levelFive(colony))
                return;
        if (rcl.isGreaterThanOrEqualTo(6, 0))
            if (this.levelSix(colony))
                return;
        if (rcl.isGreaterThanOrEqualTo(7, 0))
            if (this.levelSeven(colony))
                return;
        if (rcl.isGreaterThanOrEqualTo(8, 0))
            if (this.levelEight(colony))
                return;
    }

    private levelOne(colony: Colony): boolean {
        let rcl = colony.getEffectiveRcl();
        let opStarted = false;
        if (rcl.isEqualTo(1, 1)) { // need source container            
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_INFRASTRUCTURE,
                1,
                () => new HarvestInfrastructureOperation(colony.resourceManager.sourceAId),
                (op: HarvestInfrastructureOperation) => op.sourceId == colony.resourceManager.sourceAId);
            opStarted = true;
        }

        if (rcl.isEqualTo(1, 2)) { // second source
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
        let rcl = colony.getEffectiveRcl();
                
        if (rcl.isEqualTo(2, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(2));
            return true;
        }

        if (rcl.isEqualTo(2, 1)) {
            this.ensureOperation(
                colony,
                OPERATION_CONTROLLER_INFRASTRUCTURE,
                1,
                () => new ControllerInfrastructureOperation());
            return true;
        }

        if (rcl.isGreaterThanOrEqualTo(2, 2))
            this.ensureOperation(
                colony,
                OPERATION_WALL_CONSTRUCTION,
                1,
                () => new WallConstructionOperation());

        return false;
    }

    private levelThree(colony: Colony): boolean {
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(3, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(3));
            return true;
        }
                
        if (rcl.isEqualTo(3, 1)) {
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
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(4, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_STORAGE_CONSTRUCTION,
                1,
                () => new StorageConstructionOperation());
            return true;
        }

        if (rcl.isEqualTo(4, 1)) {
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
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(5, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(5));
            return true;
        }

        if (rcl.isEqualTo(5, 1)) {
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_LINK_CONSTRUCTION,
                1,
                () => new HarvestLinkConstructionOperation(colony.resourceManager.sourceAId));
            return true;
        }

        if (rcl.isEqualTo(5, 2)) {
            this.ensureOperation(
                colony,
                OPERATION_UPGRADE_LINK_CONSTRUCTION,
                1,
                () => new UpgradeLinkConstructionOperation());
            return true;
        }
            
        if (rcl.isEqualTo(5, 3)) {
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
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(6, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(6));
            return true;
        }

        if (rcl.isEqualTo(6, 1)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_LINK_CONSTRUCTION,
                1,
                () => new ExtensionLinkConstructionOperation());
            return true;
        }
                
        if (rcl.isEqualTo(6, 2)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTRACTOR_CONSTRUCTION,
                1,
                () => new ExtractorConstructionOperation());
            return true;
        }

        if (rcl.isEqualTo(6, 3)) {
            this.ensureOperation(
                colony,
                OPERATION_TERMINAL_CONSTRUCTION,
                1,
                () => new TerminalConstructionOperation());
            return true;
        }

        if (rcl.isEqualTo(6, 4)) {
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
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(7, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_SPAWN_CONSTRUCTION,
                1,
                () => new SpawnConstructionOperation(7));
            return true;
        }
                
        if (rcl.isEqualTo(7, 1)) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(7));
            return true;
        }
                
        if (rcl.isEqualTo(7, 2)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(7));
            return true;
        }

        if (rcl.isEqualTo(7, 3)) {
            this.ensureOperation(
                colony,
                OPERATION_HARVEST_LINK_CONSTRUCTION,
                1,
                () => new HarvestLinkConstructionOperation(colony.resourceManager.sourceBId));
            return true;
        }
                
        if (rcl.isEqualTo(7, 4)) {
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
        let rcl = colony.getEffectiveRcl();
        if (rcl.isEqualTo(8, 0)) {
            this.ensureOperation(
                colony,
                OPERATION_SPAWN_CONSTRUCTION,
                1,
                () => new SpawnConstructionOperation(8));
            return true;
        }
                
        if (rcl.isEqualTo(8, 1)) {
            this.ensureOperation(
                colony,
                OPERATION_TOWER_CONSTRUCTION,
                1,
                () => new TowerConstructionOperation(8));
            return true;
        }
                
        if (rcl.isEqualTo(8, 2)) {
            this.ensureOperation(
                colony,
                OPERATION_EXTENSION_CONSTRUCTION,
                1,
                () => new ExtensionConstructionOperation(8));
            return true;
        }

        if (rcl.isEqualTo(8, 3)) {
            this.ensureOperation(
                colony,
                OPERATION_STORAGE_LINK_CONSTRUCTION,
                1,
                () => new StorageLinkConstructionOperation());
            return true;
        }
                
        if (rcl.isEqualTo(8, 4)) {
            this.ensureOperation(
                colony,
                OPERATION_OBSERVER_CONSTRUCTION,
                1,
                () => new ObserverConstructionOperation());
            return true;
        }
                
        if (rcl.isEqualTo(8, 5)) {
            this.ensureOperation(
                colony,
                OPERATION_LAB_CONSTRUCTION,
                1,
                () => new LabConstructionOperation(8));
            return true;
        }

        if (rcl.isEqualTo(8, 6) && this.originalSpawnNeedsMoving(colony)) {
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
}
