import { ColonyPlanRegistration } from "./registration/ColonyPlanRegistration";
import { OperationRegistration } from "./registration/OperationRegistration";

export class Register {
    public static register() {
        ColonyPlanRegistration.register();
        OperationRegistration.register();
    }
}
