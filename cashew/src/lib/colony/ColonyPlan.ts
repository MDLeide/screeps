import { Guid } from "../../util/GUID";
import { Colony } from "./Colony"
import { Milestone } from "./Milestone";
import { ColonyOperation } from "./ColonyOperation"
import { ColonyOperationRepository } from "./repo/ColonyOperationRepository";

/**
 This class describes the long-term plan for a colony. Using milestones, it determines what operations
 should occur, and when. It also manages the lifecycle of those operations.
 */
export class ColonyPlan {
    private get _milestoneIndex(): number { return this.state.milestoneIndex; }
    private set _milestoneIndex(val: number) { this.state.milestoneIndex = val; }
    private _initializedOperations: { [opId: string]: ColonyOperation } = {};
    private _runningOperations: { [opId: string]: ColonyOperation } = {};
    private _getOperations: (milestone: Milestone) => ColonyOperation[];
    private _colonyOperationRepository: ColonyOperationRepository;

    
    constructor(name: string, description: string, milestones: Milestone[], getOperations: (milestone: Milestone) => ColonyOperation[]) {
        this.state = {
            id: Guid.newGuid(),
            name: name,
            milestoneIndex: 0,
            operationsThisMilestone: [],
            operationsLastMilestone: [],
            initializedOps: [],
            runningOps: []
        };
        
        this.milestones = milestones;
        this.description = description;
        this._getOperations = getOperations;
    }



    public state: ColonyPlanMemory;

    public get id(): string { return this.state.id; }
    public get name(): string { return this.state.name; }
    public get mostRecentMilestone(): Milestone { return this.milestones[this._milestoneIndex]; }

    public get operationNamesCompletedThisMilestone(): string[] { return this.state.operationsThisMilestone; }
    public set operationNamesCompletedThisMilestone(val: string[]) { this.state.operationsThisMilestone = val; }

    public get operationNamesCompletedLastMilestone(): string[] { return this.state.operationsLastMilestone; }
    public set operationNamesCompletedLastMilestone(val: string[]) { this.state.operationsLastMilestone = val; }
    
    public get initializedOperations(): { [opId: string]: ColonyOperation } {
        if (!this._initializedOperations) {
            this._initializedOperations = {}
            for (var i = 0; i < this.state.initializedOps.length; i++) {
                this._initializedOperations[this.state.initializedOps[i]] = this._colonyOperationRepository.get(this.state.initializedOps[i]);
            }
        }
        return this._initializedOperations;
    }
    public get runningOperations(): { [opId: string]: ColonyOperation } {
        if (!this._runningOperations) {
            this._runningOperations = {}
            for (var i = 0; i < this.state.runningOps.length; i++) {
                this._runningOperations[this.state.runningOps[i]] = this._colonyOperationRepository.get(this.state.runningOps[i]);
            }
        }
        return this._runningOperations;
    }
    
    public description: string;
    public milestones: Milestone[];
    public milestoneOperations: ColonyOperation[] = [];


    //## update loop

    /** Updates the plan, checks for a new milestone, updates all operations. */
    public update(colony: Colony): void {
        if (this._milestoneIndex + 1 < this.milestones.length && this.milestones[this._milestoneIndex + 1].isMet(colony)) {
            this._milestoneIndex++;
            this.operationNamesCompletedLastMilestone = this.operationNamesCompletedThisMilestone;
            this.operationNamesCompletedThisMilestone = [];
            this.milestoneOperations = this._getOperations(this.mostRecentMilestone);
        }

        // update ops
        for (var i = 0; i < this.milestoneOperations.length; i++) {
            this.milestoneOperations[i].update(colony);
        }

        // check to init ops
        for (var i = 0; i < this.milestoneOperations.length; i++) {
            if (this.milestoneOperations[i].canInit(colony)) {
                this.milestoneOperations[i].init(colony);
                this.initializedOperations[this.milestoneOperations[i].id] = this.milestoneOperations[i];
            }
        }

        // check to start ops
        for (var i = 0; i < this.milestoneOperations.length; i++) {
            if (this.milestoneOperations[i].canStart(colony)) {
                this.milestoneOperations[i].start(colony);
                this.runningOperations[this.milestoneOperations[i].id] = this.milestoneOperations[i];
                delete this.initializedOperations[this.milestoneOperations[i].id];
            }
        }
    }

    public execute(colony: Colony): void {
        //todo: spawning code, figure out how to keep track of newly spawned creeps
        // chec the colony operation
        for (var key in this.initializedOperations) {
            this.spawnCreepsForOperation(this.initializedOperations[key], colony)
        }

        for (var key in this.runningOperations) {
            this.spawnCreepsForOperation(this.initializedOperations[key], colony)
        }

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

    //## end update loop

    /** Spawns creeps required for an operation. */
    private spawnCreepsForOperation(op: ColonyOperation, colony: Colony) {
        var req = op.getRemainingCreepRequirements(colony);
        for (var i = 0; i < req.length; i++) {
            var response = colony.spawnCreep(req[i]);            
            if (response) {
                op.creepIsSpawning(req[i]);
            }
        }
    }

}
