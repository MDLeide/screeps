import { OperationRepository } from "../../lib/operation/OperationRepository";
import { FlagOperationRepository } from "lib/operation/FlagOperation";

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
import { DismantleOperation } from "../operation/military/DismantleOperation";
import { LootOperation } from "../operation/military/LootOperation";

// flags
import { DismantleFlagOperation } from "../operation/flag/DismantleFlagOperation";
import { LootFlagOperation } from "../operation/flag/LootFlagOperation";
import { ClaimRoomOperation } from "../operation/military/ClaimRoomOperation";
import { NewSpawnConstructionOperation } from "../operation/infrastructure/NewSpawnConstructionOperation";


export class OperationRegistration {
    public static register() {
        this.registerEconomy();
        this.registerInfrastructure();
        this.registerMilitary();
        this.registerFlagOps();
    }

    static registerInfrastructure(): void {
        OperationRepository.register(
            OPERATION_RESERVATION,
            (memory: any) => ReservationOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_ROOM_SCOUT,
            (memory: any) => RoomScoutOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_LIGHT_UPGRADE,
            (memory: any) => LightUpgradeOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_HEAVY_UPGRADE,
            (memory: any) => HeavyUpgradeOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_HARVEST,
            (memory: any) => HarvestOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_REMOTE_HARVEST_SCOUT,
            (memory: any) => RemoteHarvestScoutOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_REMOTE_HARVEST,
            (memory: any) => RemoteHarvestOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_ENERGY_TRANSPORT,
            (memory: any) => EnergyTransportOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_EXTRACTION,
            (memory: any) => ExtractionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_EXTENSION_FILL,
            (memory: any) => ExtensionFillOperation.fromMemory(memory));
    }

    static registerEconomy(): void {
        OperationRepository.register(
            OPERATION_STORAGE_CONSTRUCTION,
            (memory: any) => StorageConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_TOWER_CONSTRUCTION,
            (memory: any) => TowerConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_HARVEST_INFRASTRUCTURE,
            (memory: any) => HarvestInfrastructureOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_EXTENSION_CONSTRUCTION,
            (memory: any) => ExtensionConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_CONTROLLER_INFRASTRUCTURE,
            (memory: any) => ControllerInfrastructureOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_HARVEST_LINK_CONSTRUCTION,
            (memory: any) => HarvestLinkConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_UPGRADE_LINK_CONSTRUCTION,
            (memory: any) => UpgradeLinkConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_EXTENSION_LINK_CONSTRUCTION,
            (memory: any) => ExtensionLinkConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_LAB_CONSTRUCTION,
            (memory: any) => LabConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_EXTRACTOR_CONSTRUCTION,
            (memory: any) => ExtractorConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_TERMINAL_CONSTRUCTION,
            (memory: any) => TerminalConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_OBSERVER_CONSTRUCTION,
            (memory: any) => ObserverConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_STORAGE_LINK_CONSTRUCTION,
            (memory: any) => StorageLinkConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_WALL_CONSTRUCTION,
            (memory: any) => WallConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_ROAD_CONSTRUCTION,
            (memory: any) => RoadConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_SPAWN_CONSTRUCTION,
            (memory: any) => SpawnConstructionOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_REPLACE_ORIGINAL_SPAWN,
            (memory: any) => ReplaceOriginalSpawnOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_NEW_SPAWN_CONSTRUCTION,
            (memory: any) => NewSpawnConstructionOperation.fromMemory(memory));
    }

    static registerMilitary(): void {
        OperationRepository.register(
            OPERATION_ROOM_DEFENSE,
            (memory: any) => RoomDefenseOperation.fromMemory(memory));

        OperationRepository.register(
            OPERATION_DISMANTLE,
            (mem: any) => DismantleOperation.fromMemory(mem));

        OperationRepository.register(
            OPERATION_LOOT,
            (mem: any) => LootOperation.fromMemory(mem));

        OperationRepository.register(
            OPERATION_CLAIM_ROOM,
            (mem: any) => ClaimRoomOperation.fromMemory(mem));
    }

    static registerFlagOps(): void {
        FlagOperationRepository.register(
            FLAG_OPERATION_DISMANTLE,
            (flag: Flag) => new DismantleFlagOperation(flag));
        FlagOperationRepository.register(
            FLAG_OPERATION_LOOT,
            (flag: Flag) => new LootFlagOperation(flag));
    }
}
