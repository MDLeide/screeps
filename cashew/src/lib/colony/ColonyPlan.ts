import { Guid } from "../../util/GUID";

import { Colony } from "./Colony"
import { Milestone } from "./Milestone";
import { ColonyOperation } from "./ColonyOperation"
import { OperationGroup } from "./OperationGroup";

import { ColonyOperationRepository } from "./repo/ColonyOperationRepository";
import { OperationGroupRepo } from "./repo/OperationGroupRepo";

/**
 This class describes the long-term plan for a colony. Using milestones, it determines what operations
 should occur, and when. It also manages the lifecycle of those operations.
 */
export class ColonyPlan {
    private get _milestoneIndex(): number { return this.state.milestoneIndex; }
    private set _milestoneIndex(val: number) { this.state.milestoneIndex = val; }

    private _getOperations: (colony: Colony, milestone: Milestone) => ColonyOperation[];

    private _operationGroupRepo: OperationGroupRepo;
    private get operationGroupRepo(): OperationGroupRepo {
        if (!this._operationGroupRepo)
            this._operationGroupRepo = new OperationGroupRepo();
        return this._operationGroupRepo;
    }

    private _currentOps: OperationGroup;


    constructor(name: string, description: string, milestones: Milestone[], getOperations: (colony: Colony, milestone: Milestone) => ColonyOperation[]) {
        this.state = {
            id: Guid.newGuid(),
            name: name,
            milestoneIndex: -1,
            currentOps: ""
        };

        this.milestones = milestones;
        this.description = description;
        this._getOperations = getOperations;
    }

    public state: ColonyPlanMemory;

    public get id(): string { return this.state.id; }
    public get name(): string { return this.state.name; }
    public get mostRecentMilestone(): Milestone { return this.milestones[this._milestoneIndex]; }
    
    public description: string;
    public milestones: Milestone[];
    public get currentOperations(): OperationGroup {
        if (!this._currentOps && this.state.currentOps) // first op edge case
            this._currentOps = this.operationGroupRepo.find(this.state.currentOps);
        return this._currentOps;
    }


    //## update loop

    /** Updates the plan, checks for a new milestone, updates all operations. */
    public update(colony: Colony): void {
        this.checkForNewMilestone(colony);
        this.currentOperations.update(colony);
    }

    public execute(colony: Colony): void {
        this.currentOperations.execute(colony);
    }

    public cleanup(colony: Colony): void {
        this.currentOperations.cleanup(colony);
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

        var newOperations = this._getOperations(colony, this.mostRecentMilestone);
        this._currentOps = new OperationGroup(newOperations);

        this.operationGroupRepo.add(this._currentOps);
        this.state.currentOps = this._currentOps.id;
    }
}
