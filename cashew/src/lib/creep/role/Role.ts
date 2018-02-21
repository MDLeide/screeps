import { RoleState } from "./state/RoleState";
import { IRoleState } from "./state/IRoleState";
import { Activity } from "../activity/Activity";
import { ActivityResponse } from "../activity/ActivityResponse";
import { ActivityResult } from "../activity/ActivityResult";
import { ActivityStatus } from "../activity/ActivityStatus";
import { EmptyActivity } from "../activity/EmptyActivity";
import { ActivityRepo } from "../activity/ActivityRepo";

export abstract class Role {
    private _creep: Creep | null;
    private _activity: Activity | null;
    
    constructor(creep: Creep, roleId: string, state?: IRoleState ) {
        this.state = state ? state : new RoleState();        
        this._creep = creep;
        this.state.creepId = creep.id;
        this.state.id = roleId;
    }

    public state: IRoleState;

    /** Unique name of the role. */
    public get id(): string {
        return this.state.id;
    }

    /** The creep that this role is assigned to. */
    public get creep(): Creep {
        if (!this._creep) {
            this._creep = Game.getObjectById<Creep>(this.state.creepId);
        }
        if (this._creep) {
            return this._creep;
        } else {
            throw new Error('invalid operation');
        }
    }

    /** True if null or empty activity. */
    public get isIdle(): boolean {
        return (!this.activity || this.activity.id === 'idle');
    }

    /** Gets the role's current activity. Loads from state if required. Only available after init(). */
    public get activity(): Activity {
        if (!this._activity) {
            if (!this.state.activity) {
                this._activity = new EmptyActivity(this.creep);
            } else {
                this._activity = ActivityRepo.LoadFromState(this.state.activity);
            }
        }
        return this._activity;
    }
    
    //todo: role response
    public execute(): void {
        this.preIdleCheck();
        if (this.isIdle) {            
            this.setActivity(this.nextActivity());            
        }
        
        let executeAgain: boolean = true;
        while (executeAgain) {            
            this.preActivityValidation();
            
            if (!this.activity.isValid()) {                
                if (!this.activity.tryMakeValid()) {                    
                    this.activity.invalidate();
                    this.setActivity(this.nextActivity());
                }
            }
            
            this.preActivityExecution(this.activity);
            var activityResponse = this.activity.execute();                        
            executeAgain = this.postActivityExecution(activityResponse);

            if (activityResponse.result == ActivityResult.ERROR) {
                //this.printError(activityResponse);

                if (activityResponse.status == ActivityStatus.NO_VALID_TARGETS) {
                    this.setActivity(this.nextActivity());
                }
            }
        }        
    }

    private printError(activityResponse: ActivityResponse): void {
        var errorString = "<span style='color:grey'>error ";
        switch (activityResponse.status) {
            case ActivityStatus.COMPLETE:
                errorString += "(COMPLETE)"
                break;
            case ActivityStatus.FATIGUED:
                errorString += "(FATIGUED)"
                break;
            case ActivityStatus.MOVING:
                errorString += "(MOVING)"
                break;
            case ActivityStatus.NO_VALID_TARGETS:
                errorString += "(NO_VALID_TARGETS)"
                break;
            case ActivityStatus.OTHER:
                errorString += "(OTHER)"
                break;
            case ActivityStatus.PATHFIND_ERROR:
                errorString += "(PATHFIND_ERROR)"
                break;
            case ActivityStatus.PREDICT_COMPLETE:
                errorString += "(PREDICT_COMPLETE)"
                break;
            case ActivityStatus.WORKING:
                errorString += "(WORKING)"
                break;
        }

        errorString += "</span>";

        if (activityResponse.errorContext) {
            errorString += ": " + activityResponse.errorContext.toString();
        }

        console.log(
            "<span style='color:red'>" +

            "A " +

            "<span style='color:yellow'>" +
            this.id +
            "</span>" +

            " that was " +

            "<span style='color:lightblue'>" +
            this.activity.id +
            "</span>" +

            " encountered an " +

            "<span style='color:white'>" +
            errorString +
            "</span>" +
            "</span>");        
    }

    public abstract onDeath(): void;

    /**
     * Allows an inhereting class to execute code prior to the Role checking if the Activity is idle. This
     * can be useful for saving turns in certain cases.
     */
    protected abstract preIdleCheck(): void;

    /**
     * Allows an inhereting class to execute code prior to activity validation.
     */
    protected abstract preActivityValidation(): void;

    /**
     * After the activity has been selected, this allows an inhereting class to perform any activity specific
     * actions it may need to.
     * @param activity
     */
    protected abstract preActivityExecution(activity: Activity): void;

    /**
    * Allows an inhereting class the opportunity to make adjustments to the orders, activity, etc. in preperation
    * for next turn. In addition, it could change the orders phase and return true, in the case where multiple
    * activity executions may be possible in one turn.
    * @param executionResponse
    * @returns true if the role should execute again
    */
    protected abstract postActivityExecution(executionResponse: ActivityResponse): boolean; // true to execute again

    protected abstract getNextActivity(): Activity;
    
    // this will loop, requesting activities from the orders object, until
    // we get either a valid one, or null. if null, we will assign the empty activity
    private nextActivity(): Activity {
        var activity = this.getNextActivity();
        if (!activity) {
            activity = new EmptyActivity(this.creep);
        }
        return activity;
    }

    /** Sets the current activity. */
    protected setActivity(activity: Activity): void {
        this._activity = activity;
        this.state.activity = this._activity.state;
    }
    
    public cleanup(): void {
        this.activity.cleanup();
    }

    public toString(): string {
        return 'Role: ' + this.id;
    }
    
    //public static LoadFromState<T extends Role>(state: IRoleState, instance: T, creep?: Creep): T {
    //    if (instance === null || instance === undefined) {
    //        throw new Error('Invalid operation - optional param is required.');
    //    }
    //    instance.state = state;
    //    if (creep) {
    //        instance._creep = creep;
    //    }        
    //    instance._activity = activityRepo.LoadFromState(state.activity);
    //    return instance;
    //}
}
