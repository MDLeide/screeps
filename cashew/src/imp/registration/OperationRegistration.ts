import { OperationRepository } from "../../lib/operation/OperationRepository";

// economy
import { ExtractionOperation } from "../operation/economic/ExtractionOperation";
import { ExtensionFillOperation } from "../operation/economic/ExtensionFillOperation";
import { HarvestOperation, HarvestOperationMemory } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { RemoteHarvestScoutOperation, RemoteHarvestScoutOperationMemory } from "../operation/economic/RemoteHarvestScoutOperation";
import { RemoteHarvestOperation, RemoteHarvestOperationMemory } from "../operation/economic/RemoteHarvestOperation";

// infrastructure
import { ExtensionConstructionOperation, ExtensionConstructionOperationMemory } from "../operation/infrastructure/ExtensionsOperation";
import { HarvestInfrastructureOperation, HarvestInfrastructureOperationMemory } from "../operation/infrastructure/HarvestInfrastructureOperation";
import { ControllerInfrastructureOperation } from "../operation/infrastructure/ControllerInfrastructureOperation";
import { TowerConstructionOperation, TowerConstructionOperationMemory } from "../operation/infrastructure/TowerConstructionOperation";
import { StorageConstructionOperation } from "../operation/infrastructure/StorageConstructionOperation";
import { HarvestLinkConstructionOperation, HarvestLinkConstructionOperationMemory } from "../operation/infrastructure/HarvestLinkConstructionOperation";
import { UpgradeLinkConstructionOperation } from "../operation/infrastructure/UpgradeLinkConstruction";
import { ExtensionLinkConstructionOperation } from "../operation/infrastructure/ExtensionLinkConstruction";
import { LabConstructionOperation, LabConstructionOperationMemory } from "../operation/infrastructure/LabConstructionOperation";
import { ExtractorConstructionOperation } from "../operation/infrastructure/ExtractorConstructionOperation";
import { TerminalConstructionOperation } from "../operation/infrastructure/TerminalConstructionOperation";
import { ObserverConstructionOperation } from "../operation/infrastructure/ObserverConstructionOperation";
import { StorageLinkConstructionOperation } from "../operation/infrastructure/StorageLinkConstructionOperation";
import { WallConstructionOperation } from "../operation/infrastructure/WallConstructionOperation";
import { RoadConstructionOperation } from "../operation/infrastructure/RoadConstructionOperation";
import { SpawnConstructionOperation, SpawnConstructionOperationMemory } from "../operation/infrastructure/SpawnConstructionOperation";
import { ReplaceOriginalSpawnOperation } from "../operation/infrastructure/ReplaceOriginalSpawnOperation"

// military
import { RoomDefenseOperation } from "../operation/military/RoomDefenseOperation"; 
import { ReservationOperation, ReservationOperationMemory } from "../operation/military/ReservationOperation";
import { RoomScoutOperation, RoomScoutOperationMemory } from "../operation/military/RoomScoutOperation";

export class OperationRegistration {
    public static register() {
        this.registerEconomy();
        this.registerInfrastructure();
        this.registerMilitary();
    }

    static registerInfrastructure(): void {
        OperationRepository.register(
            OPERATION_RESERVATION,
            (memory: any) => ReservationOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as ReservationOperationMemory;
                return new ReservationOperation(mem.roomName);
            });

        OperationRepository.register(
            OPERATION_ROOM_SCOUT,
            (memory: any) => RoomScoutOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as RoomScoutOperationMemory;
                return new RoomScoutOperation(mem.targetRoomName);
            });

        OperationRepository.register(
            OPERATION_LIGHT_UPGRADE,
            (memory: any) => LightUpgradeOperation.fromMemory(memory),
            (flag?: Flag) => new LightUpgradeOperation());

        OperationRepository.register(
            OPERATION_HEAVY_UPGRADE,
            (memory: any) => HeavyUpgradeOperation.fromMemory(memory),
            (flag?: Flag) => new HeavyUpgradeOperation());

        OperationRepository.register(
            OPERATION_HARVEST,
            (memory: any) => HarvestOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as HarvestOperationMemory;
                return new HarvestOperation(mem.sourceId, mem.containerId, mem.linkId);
            });

        OperationRepository.register(
            OPERATION_REMOTE_HARVEST_SCOUT,
            (memory: any) => RemoteHarvestScoutOperation.fromMemory(memory),
            (flag?: Flag) => new RemoteHarvestScoutOperation());

        OperationRepository.register(
            OPERATION_REMOTE_HARVEST,
            (memory: any) => RemoteHarvestOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as RemoteHarvestOperationMemory;
                return new RemoteHarvestOperation(mem.sourceId, mem.roomName);
            });

        OperationRepository.register(
            OPERATION_ENERGY_TRANSPORT,
            (memory: any) => EnergyTransportOperation.fromMemory(memory),
            (flag?: Flag) => new EnergyTransportOperation());

        OperationRepository.register(
            OPERATION_EXTRACTION,
            (memory: any) => ExtractionOperation.fromMemory(memory),
            (flag?: Flag) => new ExtractionOperation());

        OperationRepository.register(
            OPERATION_EXTENSION_FILL,
            (memory: any) => ExtensionFillOperation.fromMemory(memory),
            (flag?: Flag) => new ExtensionFillOperation());
    }

    static registerEconomy(): void {
        OperationRepository.register(
            OPERATION_STORAGE_CONSTRUCTION,
            (memory: any) => StorageConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new StorageConstructionOperation());

        OperationRepository.register(
            OPERATION_TOWER_CONSTRUCTION,
            (memory: any) => TowerConstructionOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as TowerConstructionOperationMemory;
                return new TowerConstructionOperation(mem.rcl);
            });

        OperationRepository.register(
            OPERATION_HARVEST_INFRASTRUCTURE,
            (memory: any) => HarvestInfrastructureOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as HarvestInfrastructureOperationMemory;
                return new HarvestInfrastructureOperation(mem.sourceId);
            });

        OperationRepository.register(
            OPERATION_EXTENSION_CONSTRUCTION,
            (memory: any) => ExtensionConstructionOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as ExtensionConstructionOperationMemory;
                return new ExtensionConstructionOperation(mem.rcl);
            });

        OperationRepository.register(
            OPERATION_CONTROLLER_INFRASTRUCTURE,
            (memory: any) => ControllerInfrastructureOperation.fromMemory(memory),
            (flag?: Flag) => new ControllerInfrastructureOperation());

        OperationRepository.register(
            OPERATION_HARVEST_LINK_CONSTRUCTION,
            (memory: any) => HarvestLinkConstructionOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as HarvestLinkConstructionOperationMemory;
                return new HarvestLinkConstructionOperation(mem.sourceId);
            });

        OperationRepository.register(
            OPERATION_UPGRADE_LINK_CONSTRUCTION,
            (memory: any) => UpgradeLinkConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new UpgradeLinkConstructionOperation());

        OperationRepository.register(
            OPERATION_EXTENSION_LINK_CONSTRUCTION,
            (memory: any) => ExtensionLinkConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new ExtensionLinkConstructionOperation());

        OperationRepository.register(
            OPERATION_LAB_CONSTRUCTION,
            (memory: any) => LabConstructionOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as LabConstructionOperationMemory;
                return new LabConstructionOperation(mem.rcl);
            });

        OperationRepository.register(
            OPERATION_EXTRACTOR_CONSTRUCTION,
            (memory: any) => ExtractorConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new ExtractorConstructionOperation());

        OperationRepository.register(
            OPERATION_TERMINAL_CONSTRUCTION,
            (memory: any) => TerminalConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new TerminalConstructionOperation());

        OperationRepository.register(
            OPERATION_OBSERVER_CONSTRUCTION,
            (memory: any) => ObserverConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new ObserverConstructionOperation());

        OperationRepository.register(
            OPERATION_STORAGE_LINK_CONSTRUCTION,
            (memory: any) => StorageLinkConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new StorageLinkConstructionOperation());

        OperationRepository.register(
            OPERATION_WALL_CONSTRUCTION,
            (memory: any) => WallConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new WallConstructionOperation());

        OperationRepository.register(
            OPERATION_ROAD_CONSTRUCTION,
            (memory: any) => RoadConstructionOperation.fromMemory(memory),
            (flag?: Flag) => new RoadConstructionOperation());

        OperationRepository.register(
            OPERATION_SPAWN_CONSTRUCTION,
            (memory: any) => SpawnConstructionOperation.fromMemory(memory),
            (flag?: Flag) => {
                let mem = flag.memory.flagOperation.operation as SpawnConstructionOperationMemory;
                return new SpawnConstructionOperation(mem.rcl);
            });

        OperationRepository.register(
            OPERATION_REPLACE_ORIGINAL_SPAWN,
            (memory: any) => ReplaceOriginalSpawnOperation.fromMemory(memory),
            (flag?: Flag) => new ReplaceOriginalSpawnOperation());	

    }

    static registerMilitary(): void {
        OperationRepository.register(
            OPERATION_ROOM_DEFENSE,
            (memory: any) => RoomDefenseOperation.fromMemory(memory),
            (flag?: Flag) => new RoomDefenseOperation());
    }

    //static registerInfrastructure(): void {
    //    OperationRepository.register(
    //        OPERATION_SPAWN_CONSTRUCTION,
    //        (memory: any) => SpawnConstructionOperation.fromMemory(memory),
    //        (flag?: Flag) => new SpawnConstructionOperation((flag.memory.flagOperation.operation as SpawnConstructionOperationMemory).rcl));

    //    OperationRepository.register(
    //        OPERATION_REPLACE_ORIGINAL_SPAWN,
    //        (memory: any) => {
    //            return ReplaceOriginalSpawnOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_EXTENSION_CONSTRUCTION,
    //        (memory: any) => {
    //            return ExtensionConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_HARVEST_INFRASTRUCTURE,
    //        (memory: any) => {
    //            return HarvestInfrastructureOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_CONTROLLER_INFRASTRUCTURE,
    //        (memory: any) => {
    //            return ControllerInfrastructureOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_TOWER_CONSTRUCTION,
    //        (memory: any) => {
    //            return TowerConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_STORAGE_CONSTRUCTION,
    //        (memory: any) => {
    //            return StorageConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_HARVEST_LINK_CONSTRUCTION,
    //        (memory: any) => {
    //            return HarvestLinkConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_UPGRADE_LINK_CONSTRUCTION,
    //        (memory: any) => {
    //            return UpgradeLinkConstructionOperation.fromMemory(memory);
    //        });
        
    //    OperationRepository.register(
    //        OPERATION_LAB_CONSTRUCTION,
    //        (memory: any) => {
    //            return LabConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_EXTRACTOR_CONSTRUCTION,
    //        (memory: any) => {
    //            return ExtractorConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_TERMINAL_CONSTRUCTION,
    //        (memory: any) => {
    //            return TerminalConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_OBSERVER_CONSTRUCTION,
    //        (memory: any) => {
    //            return ObserverConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_STORAGE_LINK_CONSTRUCTION,
    //        (memory: any) => {
    //            return StorageLinkConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_WALL_CONSTRUCTION,
    //        (memory: any) => {
    //            return WallConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_ROAD_CONSTRUCTION,
    //        (memory: any) => {
    //            return RoadConstructionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_EXTENSION_LINK_CONSTRUCTION,
    //        (memory: any) => {
    //            return ExtensionLinkConstruction.fromMemory(memory);
    //        });
    //}

    //static registerEconomy(): void {
    //    OperationRepository.register(
    //        OPERATION_HARVEST,
    //        (memory: any) => {
    //            return HarvestOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_LIGHT_UPGRADE,
    //        (memory: any) => {
    //            return LightUpgradeOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_HEAVY_UPGRADE,
    //        (memory: any) => {
    //            return HeavyUpgradeOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_ENERGY_TRANSPORT,
    //        (memory: any) => {
    //            return EnergyTransportOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_REMOTE_HARVEST_SCOUT,
    //        (memory: any) => {
    //            return RemoteHarvestScoutOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_REMOTE_HARVEST,
    //        (memory: any) => {
    //            return RemoteHarvestOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_EXTRACTION,
    //        (memory: any) => {
    //            return ExtractionOperation.fromMemory(memory);
    //        });

    //    OperationRepository.register(
    //        OPERATION_EXTENSION_FILL,
    //        (memory: any) => {
    //            return ExtensionFillOperation.fromMemory(memory);
    //        });


    //}

    //static registerMilitary(): void {
    //    OperationRepository.register(
    //        OPERATION_ROOM_DEFENSE,
    //        (memory: any) => {
    //            return RoomDefenseOperation.fromMemory(memory);
    //        });
    //}
}
