import { Colony } from "../../../lib/colony/Colony";
import { ColonyPlan } from "../../../lib/colony/ColonyPlan";
import { ColonyOperation } from "../../../lib/colony/ColonyOperation";
import { Milestone } from "../../../lib/colony/Milestone";

export class StandardPlan extends ColonyPlan {
    constructor() {
        super(
            "standardPlan",
            "The standard economic plan used in most rooms.",
            StandardPlan.getMilestones(),
            StandardPlan.getOperations
        );
    }

    private static getMilestones(): Milestone[] {
        var m: Milestone[] = [];

        var n: Milestone;
        
    }

    private static getOperations(milestone: Milestone): ColonyOperation[] {

    }
}
