import { OperationPlan, OperationPlanRepository } from "../../lib/colony/OperationPlan";
import { InfrastructurePlan } from "../colony/InfrastructurePlan";
import { EconomyPlan } from "../colony/EconomyPlan";


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
            () => new EconomyPlan()
        );
    }
}
