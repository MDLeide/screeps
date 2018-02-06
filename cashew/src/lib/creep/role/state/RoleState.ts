import { ActivityState } from "../../activity/state/ActivityState";
import { OrdersState } from "../../activity/state/OrdersState";

export class RoleState {
    id: string;
    creepId: string;
        
    activity: ActivityState;
    init: boolean;
}