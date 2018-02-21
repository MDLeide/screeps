import { Colony } from "../colony/Colony"
import { Milestone } from "./Milestone";
import { Operation } from "../operation/Operation"
import { OperationGroup } from "../operation/OperationGroup";

/**
 This class describes the long-term plan for a colony. Using milestones, it determines what operations
 should occur, and when. It also manages the lifecycle of those operations.
 */
export class ColonyPlan {
    private _milestoneIndex: number;
    private _getOperations: (colony: Colony, milestone: Milestone) => Operation[];

    public static fromMemory(
        memory: ColonyPlanMemory,
        milestones: Milestone[],
        getOperations: (colony: Colony, milestone: Milestone) => Operation[]): ColonyPlan {

        var plan = new this(memory.name, memory.description, milestones, getOperations);
        plan._milestoneIndex = memory.milestoneIndex;
        plan.operationGroup = OperationGroup.fromMemory(memory.operationGroup);
        return plan;
    }

    constructor(
        name: string,
        description: string,
        milestones: Milestone[],
        getOperations: (colony: Colony, milestone: Milestone) => Operation[]) {

        this.name = name;
        this.description = description;
        this._milestoneIndex = -1;

        this.milestones = milestones;        
        this._getOperations = getOperations;

        this.operationGroup = new OperationGroup([]);
    }


    public name: string;
    public description: string;
    public milestones: Milestone[];
    public operationGroup: OperationGroup;
    public get mostRecentMilestone(): Milestone { return this.milestones[this._milestoneIndex]; }        
    
    
    //## update loop

    public load(): void {
        this.operationGroup.load();
    }

    /** Updates the plan, checks for a new milestone, updates all operations. */
    public update(colony: Colony): void {
        this.checkForNewMilestone(colony);
        this.operationGroup.update(colony);        
    }

    public execute(colony: Colony): void {
        this.operationGroup.execute(colony);
    }

    public cleanup(colony: Colony): void {
        this.operationGroup.cleanup(colony);
    }

    public save(): ColonyPlanMemory {
        return {
            name: this.name,
            description: this.description,
            milestoneIndex: this._milestoneIndex,
            operationGroup: this.operationGroup.save()
        };
    }

    //## end update loop


    private checkForNewMilestone(colony: Colony): void {
        if (this.isNextMilestoneMet(colony))
            this.advanceMilestone(colony);
    }

    private isNextMilestoneMet(colony: Colony) {
        return this._milestoneIndex + 1 < this.milestones.length && // there is another milestone in the list
            this.milestones[this._milestoneIndex + 1].isMet(colony); // and it is met
    }

    private advanceMilestone(colony: Colony) {
        this._milestoneIndex++;

        global.events.colony.milestoneMet(colony.name, this.mostRecentMilestone.name);

        var newOperations = this._getOperations(colony, this.mostRecentMilestone);
        for (var i = 0; i < newOperations.length; i++)
            this.operationGroup.addOperation(newOperations[i]);

        this.operationGroup.checkForCanceledOperations(this.mostRecentMilestone.id, colony);
    }
}
