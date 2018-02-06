import { Activity } from "./Activity";
import { ActivityResponse } from "./ActivityResponse";
import { ActivityResult } from "./ActivityResult";
import { ActivityStatus } from "./ActivityStatus";
import { IActivityState } from "./state/IActivityState";
import { ActivityState } from './state/ActivityState';

export class EmptyActivity extends Activity {
    public static readonly id: string = "idle";

    constructor(creep: Creep) {
        super(creep, EmptyActivity.id, '#ffffff');
    }

    public execute(): ActivityResponse {
        this.creep.say('idle');
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

    public static LoadFromState(state: IActivityState): EmptyActivity {
        var activity = Object.create(EmptyActivity.prototype);
        activity.state = state;
        return activity;
    }
}
