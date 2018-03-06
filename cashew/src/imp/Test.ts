import { ObserverConstructionOperation } from "./operation/infrastructure/ObserverConstructionOperation";
import { ExtensionFillOperation } from "./operation/economic/ExtensionFillOperation";
import { Empire } from "../lib/empire/Empire";

export class Test {

    public static test(): string {
        if (!global.empire)
            global.empire = new Empire();

        return this.addFillOperation();
    }

    static addFillOperation(): string {

        let col = global.empire.colonies[0];
        let mem = [];

        for (var i = 0; i < col.operationPlans.length; i++) {
            if (col.operationPlans[i].type == PLAN_ECONOMY) {
                let plan = col.operationPlans[i];

                for (var j = 0; j < plan.operationGroup.operations.length; j++) {
                    let currentOp = plan.operationGroup.operations[j];
                    if (currentOp.type == OPERATION_EXTENSION_FILL)
                        plan.operationGroup.operations.splice(j--, 1);
                }

                let op = new ExtensionFillOperation();
                plan.operationGroup.addOperation(op);
            }
            mem.push(col.operationPlans[i].save());
        }
        Memory.empire.colonies['Colony W1N7'].operationPlans = mem;
        return "";
    }
}
