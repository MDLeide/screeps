import { OperationRepository } from "../../lib/operation/OperationRepository";

import { ExtensionConstructionOperation } from "../operation/infrastructure/ExtensionsOperation";
import { HarvestInfrastructureOperation } from "../operation/infrastructure/HarvestInfrastructureOperation";
import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
import { ControllerInfrastructureOperation } from "../operation/infrastructure/ControllerInfrastructureOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { TowerConstructionOperation } from "../operation/infrastructure/TowerConstructionOperation";
import { StorageConstructionOperation } from "../operation/infrastructure/StorageConstructionOperation";
import { RemoteHarvestScoutOperation } from "../operation/economic/RemoteHarvestScoutOperation";
import { RemoteHarvestOperation } from "../operation/economic/RemoteHarvestOperation";
import { HarvestLinkConstructionOperation } from "../operation/infrastructure/HarvestLinkConstructionOperation";
import { UpgradeLinkConstructionOperation } from "../operation/infrastructure/UpgradeLinkConstruction";

export class OperationRegistration {
    public static register() {
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
            OPERATION_HARVEST,
            (memory: any) => {
                return HarvestOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_LIGHT_UPGRADE,
            (memory: any) => {
                return LightUpgradeOperation.fromMemory(memory);
            });

        //OperationRepository.register(
        //    "basicMaintenance",
        //    (memory: any) => {
        //        return BasicMaintenanceOperation.fromMemory(memory);
        //    });

        OperationRepository.register(
            OPERATION_CONTROLLER_INFRASTRUCTURE,
            (memory: any) => {
                return ControllerInfrastructureOperation.fromMemory(memory);
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
            OPERATION_HARVEST_LINK_CONSTRUCTION,
            (memory: any) => {
                return HarvestLinkConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            OPERATION_UPGRADE_LINK_CONSTRUCTION,
            (memory: any) => {
                return UpgradeLinkConstructionOperation.fromMemory(memory);
            });
    }
}
