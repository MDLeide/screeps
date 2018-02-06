import { Activity } from "./Activity";
import { ITargetedActivityState } from "./state/ITargetedActivityState";
import { TargetedActivityState } from "./state/TargetedActivityState";

export abstract class TargetedActivity<TTarget extends {id : string}> extends Activity {
    private _target: TTarget | null;

    constructor(
        creep: Creep,
        id: string,
        color?: string,
        state?: ITargetedActivityState) {
        super(creep, id, color, state ? state : new TargetedActivityState());
        this.canFindNewTarget = true;
    }
    
    //todo: consider how we can better encapsulate state management
    state: ITargetedActivityState;

    /**
        * The current target of the activity.
        * @returns {} 
        */
    public get target(): TTarget | null {
        if (!this._target) {
            if (this.state.targetId) {
                this._target = Game.getObjectById<TTarget>(this.state.targetId);
            }            
        }
        return this._target;
    }
    
    /**
        * Used internally by the activity to determine if it can find a new target. Defaults
        * to true
        */
    protected get canFindNewTarget(): boolean {
        return this.state.canFindNewTarget;
    }

    protected set canFindNewTarget(val: boolean) {
        this.state.canFindNewTarget = val;
    }


    /**
        * Determines if a target is valid for initial assignment.
        * @param target
        */
    protected abstract targetIsValidForAssignment(target: TTarget): boolean;

    /**
        * Determines if the current target is still valid.
        * @param target
        */
    protected abstract currentTargetIsValid(): boolean;

    /**
        * Gets a new target and assigns it to activity.target. Returns true if a target was found.
        */
    protected abstract findNewTarget(): boolean;


    /**
        * Sets the current target.
        * @param target
        */
    protected setTarget(target: TTarget | null) {
        this._target = target;
        if (target) {
            this.state.targetId = target.id;
        } else {
            this.state.targetId = '';
        }
    }

    public isValid(ignoreCreep?: boolean): boolean;
    /**
        * Basic implementation. Determines if the activity is valid.
        * @param ignoreCreep
        * @param ignoreTarget
        */
    public isValid(ignoreCreep?: boolean, ignoreTarget?: boolean): boolean {        
        if (!ignoreTarget) {
            if (!this.target) {
                return false;
            }            
            if (!this.currentTargetIsValid()) {
                return false
            } 
        }         
        return super.isValid(ignoreCreep);        
    }

    public reset(): void {
        this.canFindNewTarget = true;
        this.setTarget(null);
        super.reset();
    }
}