import { OperationRepository } from "../../lib/operation/OperationRepository";

// economy
import { ExtractionOperation } from "../operation/economic/ExtractionOperation";
import { ExtensionFillOperation } from "../operation/economic/ExtensionFillOperation";
import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { RemoteHarvestScoutOperation } from "../operation/economic/RemoteHarvestScoutOperation";
import { RemoteHarvestOperation } from "../operation/economic/RemoteHarvestOperation";

// infrastructure
import { ExtensionConstructionOperation } from "../operation/infrastructure/ExtensionsOperation";
import { HarvestInfrastructureOperation } from "../operation/infrastructure/HarvestInfrastructureOperation";
import { ControllerInfrastructureOperation } from "../operation/infrastructure/ControllerInfrastructureOperation";
import { TowerConstructionOperation } from "../operation/infrastructure/TowerConstructionOperation";
import { StorageConstructionOperation } from "../operation/infrastructure/StorageConstructionOperation";
import { HarvestLinkConstructionOperation } from "../operation/infrastructure/HarvestLinkConstructionOperation";
import { UpgradeLinkConstructionOperation } from "../operation/infrastructure/UpgradeLinkConstruction";
import { ExtensionLinkConstruction } from "../operation/infrastructure/ExtensionLinkConstruction";
import { LabConstructionOperation } from "../operation/infrastructure/LabConstructionOperation";
import { ExtractorConstructionOperation } from "../operation/infrastructure/ExtractorConstructionOperation";
import { TerminalConstructionOperation } from "../operation/infrastructure/TerminalConstructionOperation";
import { ObserverConstructionOperation } from "../operation/infrastructure/ObserverConstructionOperation";
import { StorageLinkConstructionOperation } from "../operation/infrastructure/StorageLinkConstructionOperation";
import { WallConstructionOperation } from "../operation/infrastructure/WallConstructionOperation";
import { RoadConstructionOperation } from "../operation/infrastructure/RoadConstructionOperation";

// military
import { RoomDefenseOperation } from "../operation/military/RoomDefenseOperation"; 


export class OperationRegistration {
    public static register() {
        this.registerEconomy();
        this.registerInfrastructure();
        this.registerMilitary();
    }

    static registerInfrastructure(): void {
        OperationRepository.register(
            OPERATION_EXTENSION_CONSTRUCTION,
            (memory: any) => {
                return ExtensionConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_HARVEST_INFRASTRUCTURE,
            (memory: any) => {
                return HarvestInfrastructureOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_CONTROLLER_INFRASTRUCTURE,
            (memory: any) => {
                return ControllerInfrastructureOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_TOWER_CONSTRUCTION,
            (memory: any) => {
                return TowerConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_STORAGE_CONSTRUCTION,
            (memory: any) => {
                return StorageConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_HARVEST_LINK_CONSTRUCTION,
            (memory: any) => {
                return HarvestLinkConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_UPGRADE_LINK_CONSTRUCTION,
            (memory: any) => {
                return UpgradeLinkConstructionOperation.fromMemory(memory);
            });
        
        OperationRepository.register(
            OPERATION_LAB_CONSTRUCTION,
            (memory: any) => {
                return LabConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_EXTRACTOR_CONSTRUCTION,
            (memory: any) => {
                return ExtractorConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_TERMINAL_CONSTRUCTION,
            (memory: any) => {
                return TerminalConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_OBSERVER_CONSTRUCTION,
            (memory: any) => {
                return ObserverConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_STORAGE_LINK_CONSTRUCTION,
            (memory: any) => {
                return StorageLinkConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_WALL_CONSTRUCTION,
            (memory: any) => {
                return WallConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_ROAD_CONSTRUCTION,
            (memory: any) => {
                return RoadConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_EXTENSION_LINK_CONSTRUCTION,
            (memory: any) => {
                return ExtensionLinkConstruction.fromMemory(memory);
            });
    }

    static registerEconomy(): void {
        OperationRepository.register(
            OPERATION_HARVEST,
            (memory: any) => {
                return HarvestOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_LIGHT_UPGRADE,
            (memory: any) => {
                return LightUpgradeOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_HEAVY_UPGRADE,
            (memory: any) => {
                return HeavyUpgradeOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_ENERGY_TRANSPORT,
            (memory: any) => {
                return EnergyTransportOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_REMOTE_HARVEST_SCOUT,
            (memory: any) => {
                return RemoteHarvestScoutOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_REMOTE_HARVEST,
            (memory: any) => {
                return RemoteHarvestOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_EXTRACTION,
            (memory: any) => {
                return ExtractionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_EXTENSION_FILL,
            (memory: any) => {
                return ExtensionFillOperation.fromMemory(memory);
            });


    }

    static registerMilitary(): void {
        OperationRepository.register(
            OPERATION_ROOM_DEFENSE,
            (memory: any) => {
                return RoomDefenseOperation.fromMemory(memory);
            });
    }
}
