import { OperationRepository } from "../../lib/operation/OperationRepository";

import { ExtensionsRcl2Operation } from "../operation/economic/ExtensionsRcl2Operation";
import { HarvestInfrastructureOperation } from "../operation/economic/HarvestInfrastructureOperation";
import { HarvestOperation } from "../operation/economic/HarvestOperation";
import { LightUpgradeOperation } from "../operation/economic/LightUpgradeOperation";

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
