import { ColonyPlanRegistration } from "./ColonyPlanRegistration";
import { OperationRegistration } from "./OperationRegistration";
import { ControllerRegistration } from "./ControllerRegistration";

export class Register {
    public static register() {
        ColonyPlanRegistration.register();
        OperationRegistration.register();
        ControllerRegistration.register();
    }
}
