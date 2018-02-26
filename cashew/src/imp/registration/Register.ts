import { ColonyPlanRegistration } from "./ColonyPlanRegistration";
import { OperationRegistration } from "./OperationRegistration";

export class Register {
    public static register() {
        ColonyPlanRegistration.register();
        OperationRegistration.register();
    }
}
