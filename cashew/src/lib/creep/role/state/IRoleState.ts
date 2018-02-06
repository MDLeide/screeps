import { IActivityState } from "../../activity/state/IActivityState";
import { IOrdersState } from "../../activity/state/IOrdersState";

export interface IRoleState {
    id: string;
    creepId: string;
        
    activity: IActivityState;
    init: boolean;
}