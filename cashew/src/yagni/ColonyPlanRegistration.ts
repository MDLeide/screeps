//import { ColonyPlan } from "../../lib/colonyPlan/ColonyPlan";
//import { StandardPlan } from "../colony/plans/StandardPlan";

//import { ColonyPlanRepository } from "../../lib/colonyPlan/ColonyPlanRepository";

//export class ColonyPlanRegistration {
    
//    public static register(): void {
//        ColonyPlanRepository.register(
//            PLAN_STANDARD,
//            (memory: any) => {
//                return ColonyPlan.fromMemory(
//                    memory,
//                    StandardPlan.getMilestones(),
//                    StandardPlan.getOperations);
//            },
//            () => {
//                return new ColonyPlan(
//                    PLAN_STANDARD,
//                    StandardPlan.description,
//                    StandardPlan.getMilestones(),
//                    StandardPlan.getOperations);
//            });
//    }    
//}
