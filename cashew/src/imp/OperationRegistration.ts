import { OperationRepository } from "../lib/operation/OperationRepository";

import { ExtensionsRcl2Operation } from "./colony/operations/economy/ExtensionsRcl2Operation";
import { HarvestInfrastructureOperation } from "./colony/operations/economy/HarvestInfrastructureOperation";
import { HarvestOperation } from "./colony/operations/economy/HarvestOperation";
import { LightUpgradeOperation } from "./colony/operations/economy/LightUpgradeOperation";

export class OperationRegistration {
    public static register() {
        OperationRepository.register(
            "extensionsRcl2",
            (memory: any) => {
                return ExtensionsRcl2Operation.fromMemory(memory);
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
    }
}
