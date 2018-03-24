import { OperationRegistration } from "./OperationRegistration";
import { ControllerRegistration } from "./ControllerRegistration";
import { MilitaryRegistration } from "./MilitaryRegistration";
import { MonitorRegistration } from "./MonitorRegistration";

export class Register {
    public static register() {        
        OperationRegistration.register();
        ControllerRegistration.register();
        MilitaryRegistration.register();
        MonitorRegistration.register();
    }
}
