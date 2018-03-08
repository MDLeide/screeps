import { OperationPlan, OperationPlanRepository } from "../../lib/colony/OperationPlan";
import { InfrastructurePlan } from "../colony/InfrastructurePlan";
import { RemoteMiningPlan } from "../colony/RemoteMiningPlan";
import { EconomyPlan } from "../colony/EconomyPlan";
import { DefensePlan } from "../colony/DefensePlan";

export class OperationPlanRegistration {
    public static register(): void {
        OperationPlanRepository.register(
            PLAN_ECONOMY,
            (mem: OperationPlanMemory) => EconomyPlan.fromMemory(mem),
            () => new EconomyPlan()
        );

        OperationPlanRepository.register(
            PLAN_INFRASTRUCTURE,
            (mem: OperationPlanMemory) => InfrastructurePlan.fromMemory(mem),
            () => new InfrastructurePlan()
        );

        OperationPlanRepository.register(
            PLAN_REMOTE_MINING,
            (mem: OperationPlanMemory) => RemoteMiningPlan.fromMemory(mem),
            () => new RemoteMiningPlan()
        );
        
        OperationPlanRepository.register(
            PLAN_DEFENSE,
            (mem: OperationPlanMemory) => DefensePlan.fromMemory(mem),
            () => new DefensePlan()
        );
    }
}
