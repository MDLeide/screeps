import { StandardPlan } from "./colony/plans/StandardPlan";

import { ColonyPlanRepository } from "../lib/colony/repo/ColonyPlanRepository";

export class ColonyPlanRegistration {
    
    public static register(): void {
        ColonyPlanRegistration.registerNew();
        ColonyPlanRegistration.registerHydrate();
    }

    private static registerNew(): void {
        ColonyPlanRepository.registerNew(
            "standardPlan",
            () => {
                return new StandardPlan();
            });
    }

    private static registerHydrate(): void {
        ColonyPlanRepository.registerHydrate(
            "standardPlan",
            (state: any) => {
                var plan = new StandardPlan();
                plan.state = state;
                return plan;
            });
    }
}
