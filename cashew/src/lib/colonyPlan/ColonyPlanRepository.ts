import { Colony } from "../colony/Colony";
import { ColonyPlan } from "./ColonyPlan";

export class ColonyPlanRepository {
    public static register(planName: string, loadPlanDelegate: (memory: ColonyPlanMemory) => ColonyPlan, newPlanDelegate: () => ColonyPlan): void {
        this.loadDelegates[planName] = loadPlanDelegate;
        this.newDelegates[planName] = newPlanDelegate;
    }

    public static load(memory: ColonyPlanMemory): ColonyPlan {
        return this.loadDelegates[memory.type](memory);
    }

    public static getNew(planName: string): ColonyPlan {
        return this.newDelegates[planName]();
    }

    private static loadDelegates: { [planName: string]: (memory: any) => ColonyPlan } = {};
    private static newDelegates: { [planName: string]: () => ColonyPlan } = {};
}
