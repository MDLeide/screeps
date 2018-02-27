import { OperationRegistration } from "./OperationRegistration";
import { ControllerRegistration } from "./ControllerRegistration";

export class Register {
    public static register() {        
        OperationRegistration.register();
        ControllerRegistration.register();
    }
}
