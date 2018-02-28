import { OperationPlanRegistration } from "./OperationPlanRegistration";
import { ColonyProgressRegistration } from "./ColonyProgressRegistration"
import { OperationRegistration } from "./OperationRegistration";
import { ControllerRegistration } from "./ControllerRegistration";

export class Register {
    public static register() {
        OperationPlanRegistration.register();
        ColonyProgressRegistration.register();
        OperationRegistration.register();
        ControllerRegistration.register();
    }
}
