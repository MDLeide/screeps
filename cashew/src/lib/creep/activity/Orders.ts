//import { Activity } from "./Activity";
//import { Phase } from "./Phase";
//import { OrdersState } from "./state/OrdersState";
//import { IPhaseState } from "./state/IPhaseState";
//import { IOrdersState } from "./state/IOrdersState";

//export class Orders {
//    private _activityRepo: IActivityRepository;
//    //todo: expand the features of this class, allow for branching order logic, and let the orders indicate when they are no longer valid
//    private _phases :Phase[];

//    constructor(phases: Phase[], activityRepo: IActivityRepository) {
//        if (!phases || phases.length === 0) {
//            throw new Error('invalid operation');
//        }
//        this._phases = phases;
//        this._activityRepo = activityRepo;

//        this.state = new OrdersState();
//        this.state.phases = [];

//        for (var i = 0; i < phases.length; i++) {
//            this.state.phases.push(phases[i].state);
//        }
//    }


//    public get phases(): Phase[] {
//        if (!this._phases) {
//            this._phases = [];
//            for (var i = 0; i < this.state.phases.length; i++) {
//                this._phases.push(Phase.LoadFromState(this.state.phases[i], this._activityRepo));
//            }
//        }
//        return this._phases;
//    }

        
//    public state: IOrdersState;

//    get invalid(): boolean {        
//        return this.state.invalid;
//    }    

//    public get phaseCount() :number {
//        return this.phases.length;
//    }

//    public get currentPhase() : Phase  {
//        if (this.state.invalid) {
//            throw new Error("Invalid state.");
//        }
//        return this.phases[this.state.currentIndex];
//    }

//    public get autoTryNextPhase(): boolean {
//        return this.state.autoTryNextPhase;
//    }

//    public set autoTryNextPhase(val: boolean) {
//        this.state.autoTryNextPhase = val;
//    }

//    public get wrapPhases(): boolean {
//        return this.state.wrapPhases;
//    }

//    public set wrapPhases(val: boolean) {
//        this.state.wrapPhases = val;
//    }
    
//    /**
//    * Attempts to move the Orders to the next valid phase.
//    */
//    private findNextPhase(): boolean {        
//        if (this.state.invalid) {            
//            return false;            
//        }

//        this.state.currentIndex++;
//        if (this.state.currentIndex >= this.state.phases.length) {            
//            if (this.state.wrapPhases) {                
//                if (this.state.phases.length === 0) {                    
//                    return false;
//                }

//                this.state.currentIndex = 0;                
//                return true;
//            }
//            this.state.invalid = true;            
//            return false;
//        }        
//        return true;
//    }

//    /**
//    * Resets the Orders to their default state.
//    */
//    public reset() {
//        this.state.currentIndex = 0;
//        this.state.invalid = false;
//    }

//    /**
//    * Sets the phase. If the phase passed is the current phase,
//    * the activity index is reset to 0.
//    * @param indexOrName
//    */
//    public setPhase(indexOrName: string | number): void {
//        if (this.state.invalid) {
//            throw new Error('invalid operation');
//        }

//        if (typeof indexOrName === 'string') {
//            for (var i = 0; i < this.phases.length; i++) {
//                if (this.phases[i].name === indexOrName) {
//                    this.state.currentIndex = i;
//                }
//            }
//        } else if (typeof indexOrName === 'number') {
//            if (indexOrName < 0 || indexOrName >= this.state.phases.length) {
//                this.state.currentIndex = indexOrName;
//            }
//        } else {
//            throw new Error('type error');
//        }
//        this.phases[this.state.currentIndex].reset();
//    }

//    /**
//    * Gets the next available activity.
//    * @param creep
//    */
//    public getNextActivity(creep: Creep): Activity | null {
//        if (this.state.invalid) {            
//            return null;
//        }

//        var activity = this._phases[this.state.currentIndex].getNextActivity(creep);
//        if (activity) {            
//            return activity;
//        }

//        if (this.autoTryNextPhase) {            
//            if (this.findNextPhase()) {
//                return this.getNextActivity(creep);
//            }
//        }

//        this.state.invalid = true;
//        return null;
//    }

//    public static LoadFromState(state: IOrdersState, activityRepo: IActivityRepository) {
//        var orders = Object.create(Orders.prototype);
//        orders.state = state;
//        orders._activityRepo = activityRepo;
//        return orders;
//    }
//}

