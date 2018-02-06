//import { Activity } from "./Activity";
//import { IPhaseState } from "./state/IPhaseState";
//import { PhaseState } from "./state/PhaseState";

///**
//*   todo: documentation
//*   organizes a group of activities by priority. when you ask for the next activity, it is created on
//*   demand. does not store any actual instances or state.
//*/
//export class Phase {
//    private _activityRepo: IActivityRepository;

//    constructor(name: string, activityIds: string[], activityRepo: IActivityRepository) {        
//        this._activityRepo = activityRepo;

//        this.state = new PhaseState();
//        this.state.name = name;
//        this.state.activityIds = activityIds;
//    }

//    public state: IPhaseState;

//    public get name(): string {
//        return this.state.name;
//    }

//    public getNextActivity(creep: Creep): Activity | null {
//        if (this.state.invalid) {            
//            return null;
//        }

//        this.state.currentIndex++;
//        if (this.state.currentIndex >= this.state.activityIds.length) {            
//            this.state.invalid = true;            
//            return null;
//        }
        
//        //todo: either move the activity builder of refactor this        
//        return this._activityRepo.GetNew(creep, this.state.activityIds[this.state.currentIndex]);
//    }

//    public reset(): void {
//        this.state.invalid = false;
//        this.state.currentIndex = -1;
//    }

//    public static LoadFromState(state: IPhaseState, activityRepo: IActivityRepository): Phase {        
//        var phase = Object.create(Phase.prototype);
//        phase._activityRepo = activityRepo;
//        phase.state = state;
//        return phase;
//    }
//}
