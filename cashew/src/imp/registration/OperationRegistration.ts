import { OperationRepository } from "../../lib/operation/OperationRepository";

import { ExtensionsOperation } from "../operation/economic/ExtensionsOperation";
import { HarvestInfrastructureOperation } from "../operation/economic/HarvestInfrastructureOperation";
import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";
import { BasicMaintenanceOperation } from "../operation/economic/BasicMaintenanceOperation";
import { ControllerInfrastructureOperation } from "../operation/economic/ControllerInfrastructureOperation";
import { EnergyTransportOperation } from "../operation/economic/EnergyTransportOperation";
import { HeavyUpgradeOperation } from "../operation/economic/HeavyUpgradeOperation";
import { TowerConstructionOperation } from "../operation/economic/TowerConstructionOperation";
import { StorageConstructionOperation } from "../operation/economic/StorageConstructionOperation";

export class OperationRegistration {
    public static register() {
        OperationRepository.register(
            "extensions",
            (memory: any) => {
                return ExtensionsOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "harvestInfrastructure",
            (memory: any) => {
                return HarvestInfrastructureOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "harvest",
            (memory: any) => {
                return HarvestOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "lightUpgrade",
            (memory: any) => {
                return LightUpgradeOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "basicMaintenance",
            (memory: any) => {
                return BasicMaintenanceOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "controllerInfrastructure",
            (memory: any) => {
                return ControllerInfrastructureOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "heavyUpgrade",
            (memory: any) => {
                return HeavyUpgradeOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "energyTransport",
            (memory: any) => {
                return EnergyTransportOperation.fromMemory(memory);
            });
        
        OperationRepository.register(
            "towerConstruction",
            (memory: any) => {
                return TowerConstructionOperation.fromMemory(memory);
            });

        OperationRepository.register(
            "storageConstruction",
            (memory: any) => {
                return StorageConstructionOperation.fromMemory(memory);
            });
    }
}
