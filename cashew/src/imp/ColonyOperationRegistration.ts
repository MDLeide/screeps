import { HarvestInfrastructureOperation } from "./colony/operations/economy/HarvestInfrastructureOperation";

import { ColonyOperationRepository } from "../lib/colony/repo/ColonyOperationRepository";
export class ColonyOperationRegistration {
    public static register() {
        ColonyOperationRepository.register(
            "harvestInfrastructure",
            (state: any) => {
                var op = Object.create(HarvestInfrastructureOperation.prototype);
                op.state = state;
                return op;
            });
    }
}
