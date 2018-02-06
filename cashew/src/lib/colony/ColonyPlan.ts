import { Colony } from "./Colony"
import { Milestone } from "./Milestone";
import { ColonyOperation } from "./ColonyOperation"

export class ColonyPlan {
    private _milestoneIndex: number = 0;
    private _getOperations: (milestone: Milestone) => ColonyOperation[];

    public id: string;
    public name: string;
    public description: string;
    public milestones: Milestone[];
    public get mostRecentMilestone(): Milestone { return this.milestones[this._milestoneIndex]; }

    public operationNamesCompletedThisMilestone: string[] = [];
    public operationNamesCompletedLastMilestone: string[] = [];

    public runningOperations: { [opId: string]: ColonyOperation } = {};
    public milestoneOperations: ColonyOperation[] = [];

    /** Updates the plan, checks for a new milestone, updates all operations. */
    public update(colony: Colony): void {
        if (this._milestoneIndex + 1 < this.milestones.length && this.milestones[this._milestoneIndex + 1].isMet(colony)) {
            this._milestoneIndex++;
            this.operationNamesCompletedLastMilestone = this.operationNamesCompletedThisMilestone;
            this.operationNamesCompletedThisMilestone = [];
            this.milestoneOperations = this._getOperations(this.mostRecentMilestone);
        }
                
        for (var i = 0; i < this.milestoneOperations.length; i++) {
            this.milestoneOperations[i].update(colony);
        }

        for (var i = 0; i < this.milestoneOperations.length; i++) {
            if (this.milestoneOperations[i].canInit(colony)) {
                this.milestoneOperations[i].init(colony);
            }
        }

        for (var i = 0; i < this.milestoneOperations.length; i++) {
            if (this.milestoneOperations[i].canStart(colony)) {
                this.milestoneOperations[i].start(colony);
                this.runningOperations[this.milestoneOperations[i].id] = this.milestoneOperations[i];
            }
        }
    }

    public execute(colony: Colony): void {
        for (var key in this.runningOperations) {
            this.runningOperations[key].execute(colony);
        }
    }

    public cleanup(colony: Colony): void {
        var ops = this.milestoneOperations[this.mostRecentMilestone.id];
        for (var i = 0; i < ops.length; i++) {
            ops[i].cleanup(colony);
        }

        for (var key in this.runningOperations) {
            var op = this.runningOperations[key];
            if (op.isFinished(colony)) {
                op.finish(colony);
                this.operationNamesCompletedThisMilestone.push(op.name);
                delete this.runningOperations[key];
            }
        }
    }
}
