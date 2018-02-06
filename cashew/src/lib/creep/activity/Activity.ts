//todo: implement methods at the Activity level for tracking and reporting Actions used
//todo: methods to quickly construct common activity responses

import { ActivityStatus } from "./ActivityStatus";
import { ActivityResponse } from "./ActivityResponse";
import { ActivityResult } from "./ActivityResult";
import { ActivityState } from "./state/ActivityState";
import { IActivityState } from "./state/IActivityState";

import { ActionResult } from "../../../lib/creep/action/ActionResult"
import { ActionType } from "../../../lib/creep/action/ActionType";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export abstract class Activity {
    private _creep: Creep;    

    //todo:implement moveTo and isMoving, take control if moving

    constructor(creep: Creep, id: string, color?: string, state?: IActivityState) {
        this.state = state ? state : new ActivityState();
        this._creep = creep;
        this.state.creepId = creep.id;
        this.state.id = id;
        
        if (color) {
            this.color = color;
        } else {
            this.color = '';
        }

    }


    public state: IActivityState;


    public get creep(): Creep {
        if (!this._creep) {
            this._creep = Game.getObjectById<Creep>(this.state.creepId);
            if (!this._creep) {
                throw Error('invalid operation');
            }
        }

        return this._creep;
    }
    public get id(): string {
        return this.state.id;
    }
    public get color(): string {
        return this.state.color;
    }
    public set color(val: string) {
        this.state.color = val;
    }


    /**
     * Executes the main logic of the activity.
     */
    public abstract execute(): ActivityResponse;

    /**
     * Invalidates the activity. Call this if the activity needs to be terminated without
     * having the chance to complete.
     */
    public abstract invalidate(): void;

    /**
     * Called at the end of the tick.
     */
    public abstract cleanup(): void;

    /**
     * Tries to correct itself and get to a valid state (find new target, etc.). Returns true if successful.
     */
    public abstract tryMakeValid(): boolean;

    /**
     * Performs operations required to return the activitiy to its default state. This will be called
     * when a consumer calls reset() on the activity.
     */
    protected abstract onReset(): void;

    /**
     * Determines if the creep who owns the activity is in a valid state to continue working.
     */
    protected abstract creepIsValid(): boolean;

    /**
     * Performs any other state checks that might be required to validate the activity.
     */
    protected abstract otherStateIsValid(): boolean;


    /**
     * Resets the activity to its default state, as if it had been just constructed.
     */
    public reset(): void {        
        this.onReset();
    }

    /**
     * Returns true if the activity is in a valid state.
     */
    public isValid(ignoreCreep?: boolean): boolean {        
        if (!ignoreCreep && !this.creepIsValid()) {
            return false;
        }
        return this.otherStateIsValid();
    }

    /**
     * Moves the creep to the target location.
     * @param target The target location.
     */
    protected moveTo(target: RoomPosition | { pos: RoomPosition }): IActionResponse {
        var resp: number;
        if (this.color && this.color !== '') {
            resp = this.creep.moveTo(target, { visualizePathStyle: { stroke: this.color } });
        } else {
            resp = this.creep.moveTo(target);
        }
        return { type: ActionType.MOVE, result: resp };
    }

    /*
    *   Moves the creep to the target location, pushes the result onto a response stack, and returns an ActivityResponse.
    */
    protected moveAndReturn(target: RoomPosition | { pos: RoomPosition }, otherActions: IActionResponse[]): ActivityResponse {
        let response = this.moveTo(target);

        let result: ActivityResult;
        let status: ActivityStatus;
        let error: any = {};

        if (response.result === ActionResult.OK) {
            result = ActivityResult.OK;
            status = ActivityStatus.MOVING;
        } else if (response.result === ActionResult.ERR_TIRED) {
            result = ActivityResult.OK;
            status = ActivityStatus.FATIGUED;
        } else {
            result = ActivityResult.ERROR;
            status = ActivityStatus.OTHER;
            error = { 'moveResponse': response };

            if (response.result === ActionResult.ERR_NO_PATH) {
                this.creep.say('which way?');
                status = ActivityStatus.PATHFIND_ERROR;
            }
        }

        otherActions.push({ type: ActionType.MOVE, result: response.result });

        return new ActivityResponse(result, status, error, otherActions);
    }

    public toString() : string {
        return 'Activity: ' + this.id;
    }
}
