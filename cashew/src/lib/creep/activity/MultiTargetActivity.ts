import { TargetedActivity } from "./TargetedActivity";
import { TargetedActivityState } from "./state/TargetedActivityState";
import { MultiTargetActivityState } from "./state/MultiTargetActivityState";
import { ITargetedActivityState } from "./state/ITargetedActivityState";
import { IMultiTargetActivityState } from "./state/IMultiTargetActivityState";

export abstract class MultiTargetActivity<TTargetType extends { id: string }> extends TargetedActivity<TTargetType> {
    private _targetArray: TTargetType[] | null;

    constructor(creep: Creep, id: string, color?: string, state?: IMultiTargetActivityState) {
        super(creep, id, color, state ? state : new MultiTargetActivityState());
        this.canFindNewTargetArray = true;
    }

    public state: IMultiTargetActivityState;

    private get currentIndex(): number {
        return this.state.currentIndex;
    }
    private set currentIndex(val: number) {
        this.state.currentIndex = val;
    }

    protected get canFindNewTargetArray(): boolean {
        return this.state.canFindNewTargetArray;
    }
    protected set canFindNewTargetArray(val: boolean) {
        this.state.canFindNewTargetArray = val;
    }

    /**
    * Searches for a new target array and assigns it to activity.targetArray. Returns false
    * if no array could be found. Resets the currentIndex and _canFindNewTarget if successful.
    */
    protected abstract findNewTargetArray(): boolean;

    /**
    * Advances to the next target in the array. Updates the current index. If the index
    * is found to be outside the bounds, returns null, and sets canFindNew to false, which is used
    * in the implementation of canFindNewTarget.
    */
    private getNextTarget(): TTargetType | null {
        let array = this.getTargetArray();
        if (!this.canFindNewTarget || array.length === 0) {
            this.canFindNewTarget = false;
            return null;
        }

        this.currentIndex++;
        if (this.currentIndex >= array.length) {
            this.canFindNewTarget = false;
            return null;
        }

        return array[this.currentIndex];
    }

    /**
    * Sets the array being used to provide new targets, and updates the state object with their
    * ids.
    * @param targets
    */
    protected setTargetArray(targets: TTargetType[]): void {        
        this._targetArray = targets;
        var temp: string[] = [];
        for (var i = 0; i < targets.length; i++) {
            temp.push(targets[i].id);
        }
        this.state.targetArrayIds = temp;        
    }

    /**
    * Gets the array being used to provide new targets. You should not alter this directly,
    * rather create a new array and set it using setTargetArray.
    */
    protected getTargetArray(): TTargetType[] {
        if (!this._targetArray) {            
            this._targetArray = [];
            if (this.state.targetArrayIds) {                
                for (var i = 0; i < this.state.targetArrayIds.length; i++) {
                    var t = Game.getObjectById<TTargetType>(this.state.targetArrayIds[i]);
                    if (t === null) {
                        this.invalidate();
                        return [];
                    }
                    this._targetArray.push(t);
                }
            }
        }
        return this._targetArray;
    }

    /**
    * Asks for a new target from the array. If it is valid, assigns it to the current target and
    * returns true. Otherwise, it calls itself. If the target is null, a request is made for a new
    * array. If the request is successful, calls itself. Otherwise, sets _canFindNewTarget to false,
    * and returns false.
    * If the implementing class is not careful, this method may loop infinitely. This may happen if
    * a target array is repeatedly provided which contains targets, but none are valid.
    */
    protected findNewTarget(): boolean {        
        if (!this.canFindNewTarget) {            
            this.setTarget(null);
            return false;
        }
        this.setTarget(this.getNextTarget());

        // probably don't need this null check, but we'll be safe
        if (this.target) { // getNextTarget was successful            
            if (this.currentTargetIsValid()) {                
                return true; // and the target is valid
            }            
            return this.findNewTarget(); // target found, but not valid. we'll try again with the next target
        }
        // no target found        
        // can we get a new array?
        if (!this.canFindNewTargetArray) { // nope, failure            
            return false;
        }
                
        if (this.findNewTargetArray()) {
            this.canFindNewTarget = true; // we will make sure this was reset            
            return this.findNewTarget(); // new array found, try again
        }

        // could not find a new array, out of options
        this.canFindNewTarget = false;        
        return false;
    }

    public reset(): void {
        this.canFindNewTargetArray = true;
        this.setTargetArray([]);
        super.reset();
    }
}
