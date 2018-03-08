//import { Colony } from "../colony/Colony";
//import { ColonyPlan } from "./ColonyPlan";

//export class ColonyPlanRepository {
//    public static register(planType: PlanType, loadPlanDelegate: (memory: ColonyPlanMemory) => ColonyPlan, newPlanDelegate: () => ColonyPlan): void {
//        this.loadDelegates[planType] = loadPlanDelegate;
//        this.newDelegates[planType] = newPlanDelegate;
//    }

//    public static load(memory: ColonyPlanMemory): ColonyPlan {
//        return this.loadDelegates[memory.type](memory);
//    }

//    public static getNew(planType: PlanType): ColonyPlan {
//        return this.newDelegates[planType]();
//    }

//    private static loadDelegates: { [planType: string]: (memory: any) => ColonyPlan } = {};
//    private static newDelegates: { [planType: string]: () => ColonyPlan } = {};
//}
