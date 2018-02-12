import { Repository } from "../../memory/Repository"
import { ColonyPlan } from "../ColonyPlan";

export class ColonyPlanRepository extends Repository<ColonyPlan> {
    private static newDelegates: { [name: string]: () => ColonyPlan } = {};
    private static hydrateDelegates: { [name: string]: (state: any) => ColonyPlan } = {};

    constructor() {
        super("plans", ColonyPlanRepository.hydrate);
    }

    public static registerNew(name: string, create: () => ColonyPlan):void {
        ColonyPlanRepository.newDelegates[name] = create;
    }

    public static registerHydrate(name: string, hydrate: (state: any) => ColonyPlan): void {
        ColonyPlanRepository.hydrateDelegates[name] = hydrate;
    }

    private static hydrate(state: any): ColonyPlan {
        return ColonyPlanRepository.hydrateDelegates[state.name](state);
    }

    public getNew(name: string): ColonyPlan {
        return ColonyPlanRepository.newDelegates[name]();
    }
}
