import { OperationRepository } from "../../lib/operation/OperationRepository";

import { ExtensionConstruction } from "../operation/economic/ExtensionsOperation";
import { HarvestInfrastructureOperation } from "../operation/economic/HarvestInfrastructureOperation";
import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
//import { BasicMaintenanceOperation } from "../operation/economic/BasicMaintenanceOperation";
import { ControllerInfrastructureOperation } from "../operation/economic/ControllerInfrastructureOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { TowerConstructionOperation } from "../operation/economic/TowerConstructionOperation";
import { StorageConstructionOperation } from "../operation/economic/StorageConstructionOperation";

export class OperationRegistration {
    public static register() {
        OperationRepository.register(
            OPERATION_EXTENSION_CONSTRUCTION,
            (memory: any) => {
                return ExtensionConstruction.fromMemory(memory);
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
    }
}
