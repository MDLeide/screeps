import { Colony } from "./Colony";
import { ColonyPlan } from "./ColonyPlan";

export class ColonyPlanRepository {
    public static register(planName: string, loadPlanDelegate: (memory: any) => ColonyPlan, newPlanDelegate: () => ColonyPlan): void {
        this.loadDelegates[planName] = loadPlanDelegate;
        this.newDelegates[planName] = newPlanDelegate;
    }

    public static load(memory: any): ColonyPlan {
        return this.loadDelegates[memory.name](memory);
    }

    public static getNew(planName: string): ColonyPlan {
        return this.newDelegates[planName]();
    }

    private static loadDelegates: { [planName: string]: (memory: any) => ColonyPlan };
    private static newDelegates: { [planName: string]: () => ColonyPlan };
}
