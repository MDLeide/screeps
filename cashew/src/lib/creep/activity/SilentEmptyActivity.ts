import { Activity } from "./Activity";
import { ActivityResponse } from "./ActivityResponse";
import { ActivityResult } from "./ActivityResult";
import { ActivityStatus } from "./ActivityStatus";
import { IActivityState } from "./state/IActivityState";
import { ActivityState } from './state/ActivityState';

export class SilentEmptyActivity extends Activity {
    public static readonly id: string = "silentIdle";

    constructor(creep: Creep) {
        super(creep, SilentEmptyActivity.id, '#ffffff');
    }

    public execute(): ActivityResponse {        
        return new ActivityResponse(ActivityResult.OK, ActivityStatus.OTHER);
    }

    public invalidate(): void {
    }

    public cleanup(): void {
    }

    public tryMakeValid(): boolean {
        return true;
    }

    protected onReset(): void {

    }

    protected creepIsValid(): boolean {
        return true;
    }

    protected otherStateIsValid(): boolean {
        return true;
    }    
}
