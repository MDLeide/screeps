import { MultiTargetActivity } from "../../../lib/creep/activity/MultiTargetActivity";
import { ActivityStatus } from "../../../lib/creep/activity/ActivityStatus";
import { ActivityResult } from "../../../lib/creep/activity/ActivityResult";
import { ActivityResponse } from "../../../lib/creep/activity/ActivityResponse";
import { IMultiTargetActivityState } from "../../../lib/creep/activity/state/IMultiTargetActivityState";

import { ActionResult } from "../../../lib/creep/action/ActionResult";
import { ActionType } from "../../../lib/creep/action/ActionType";
import { IActionResponse } from "../../../lib/creep/action/IActionResponse";

export class WithdrawingEnergy extends MultiTargetActivity<StructureContainer | StructureStorage> {
    public static readonly id: string = "withdrawingEnergy";

    private _invalidating: boolean;
    
    constructor(creep: Creep) {
        super(creep, WithdrawingEnergy.id, '#ed6161');
    }
    
    public execute(): ActivityResponse {
        if (!this.target) {
            this.findNewTarget();
        }        

        let actions: IActionResponse[] = [];
        let withdrawResponse = this.creep.withdraw(this.target, RESOURCE_ENERGY);
        actions.push({ type: ActionType.WITHDRAW, result: withdrawResponse });

        if (withdrawResponse === ActionResult.OK) {
            return new ActivityResponse(ActivityResult.OK, ActivityStatus.PREDICT_COMPLETE, null, actions);            
        } else if (withdrawResponse === ActionResult.ERR_NOT_IN_RANGE) {
            return this.moveAndReturn(this.target, actions);
        } else {
            return new ActivityResponse(ActivityResult.ERROR, ActivityStatus.OTHER, this.target, actions);
        }        
    }

    public invalidate(): void {
        if (this._invalidating) {
            return;
        }

        this._invalidating = true;        
        this.setTarget(null);
        this.setTargetArray([]);
        this._invalidating = false;
    }

    public cleanup(): void {
    }

    public tryMakeValid(): boolean {        
        if (!this.creepIsValid()) {
            return false;
        }

        return this.findNewTarget();
    }

    protected creepIsValid(): boolean {                
        return this.creep.nut.carryCapacityAvailable > 0;
    }

    protected otherStateIsValid(): boolean {
        return true;
    }
    
    protected targetIsValidForAssignment(target: StructureContainer | StructureStorage): boolean {
        return target.store[RESOURCE_ENERGY] > 0;
    }

    protected currentTargetIsValid(): boolean {
        if (!this.target) {
            return false;        
        }

        return this.target.store[RESOURCE_ENERGY] > 50;
    }
    
    protected onReset(): void {
    }

    protected findNewTargetArray(): boolean {        
        if (!this.canFindNewTargetArray) {
            return false;
        }

        this.canFindNewTargetArray = false;

        var targets: (StructureStorage | StructureContainer)[];

        targets = this.creep.room.find<StructureContainer>(FIND_STRUCTURES,
            {
                filter: (cont: StructureContainer): boolean => {
                    return cont.structureType == STRUCTURE_CONTAINER &&
                        cont.nut.tag != "controller" &&
                        cont.store[RESOURCE_ENERGY] > 50;
                }
            });

        if (targets.length < 1) {
            return false;
        }
        
        targets.sort((a, b) => { return b.store.energy - a.store.energy });

        var storage = this.creep.room.find<StructureStorage>(FIND_MY_STRUCTURES,
            {
                filter: (storage: StructureStorage): boolean => {
                    return storage.structureType == STRUCTURE_STORAGE &&
                        storage.store.energy > 50;
                }
            })

        if (storage.length)
            targets.push(storage[0]);

        this.setTargetArray(targets);
        return true;
    }
        
    //public static LoadFromState(state: IMultiTargetActivityState): WithdrawingEnergy {
    //    let activity = Object.create(WithdrawingEnergy.prototype);
    //    activity.state = state;
    //    return activity;
    //}
}
