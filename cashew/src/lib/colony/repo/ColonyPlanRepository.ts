import { Repository } from "../../memory/Repository"
import { ColonyPlan } from "../ColonyPlan";

export class ColonyPlanRepository extends Repository<ColonyPlan> {
    constructor() {
        super(Memory.plans, ColonyPlanRepository.hydrate);
    }

    private static hydrate(state: any): ColonyPlan {
        switch (state.name) {
            case "basicPlan":
                var plan = ColonyPlanRepository.basicPlan();
                plan.state = state;
                return plan;
            default:
                throw Error("Arg out of range");                
        }
    }

    static basicPlan(): ColonyPlan {

    }
}
