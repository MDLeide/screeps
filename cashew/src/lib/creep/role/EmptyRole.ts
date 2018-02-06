import { Role } from "./Role";
import { IRoleState } from "./state/IRoleState";
import { Activity } from "../activity/Activity";
import { ActivityResponse } from "../activity/ActivityResponse";

/** Represents a <Role> that does nothing. */
export class EmptyRole extends Role {
    constructor(creep: Creep) {
        super(creep, 'empty-role');
    }

    protected preIdleCheck(): void {        
    }

    protected preActivityValidation(): void {
    }

    protected getNextActivity(): Activity {
        return null;
    }

    protected preActivityExecution(activity: Activity): void {
        if (activity) {
        }
    }
    
    protected postActivityExecution(executionResponse: ActivityResponse): boolean {
        if (executionResponse) {
            //todo: suppress
        }        
        return false;
    }

    public onDeath() : void {

    }

    //public static LoadFromState(state: IRoleState, activityRepo: IActivityRepository, instance?: EmptyRole, creep?: Creep): EmptyRole {
    //    if (!instance) {
    //        instance = Object.create(EmptyRole.prototype);
    //    }
    //    if (!instance) {
    //        throw new Error('invalid operation');
    //    }
    //    return Role.LoadFromState<EmptyRole>(state, activityRepo, instance, creep);
    //}
}
