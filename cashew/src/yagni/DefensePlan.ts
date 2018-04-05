//import { OperationPlan } from "../../lib/colony/OperationPlan";
//import { Colony } from "../../lib/colony/Colony";
//import { Operation } from "../../lib/operation/Operation";

//import { RoomDefenseOperation } from "../operation/military/RoomDefenseOperation";

//export class DefensePlan extends OperationPlan {
//    public static fromMemory(memory: OperationPlanMemory): DefensePlan {
//        let plan = new this();
//        return OperationPlan.fromMemory(memory, plan) as DefensePlan;
//    }

//    constructor() {
//        super(PLAN_DEFENSE);
//    }

//    protected onLoad(): void {
//    }

//    protected onUpdate(colony: Colony): void {
//        if (colony.watchtower.threatScore > 0 && this.operationGroup.runners.length == 0) {
//            this.addOperation(new RoomDefenseOperation());
//        }
//    }

//    protected onExecute(colony: Colony): void {
//    }

//    protected onCleanup(colony: Colony): void {
//    }
//}
