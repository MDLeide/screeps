import { Colony } from "./Colony";

import { SpawnDefinition } from "../spawn/SpawnDefinition";

import { IdArray } from "../../util/IdArray";
import { Guid } from "../../util/GUID";

export abstract class ColonyOperation {
    private _id: string;
    private _creepRequirement: SpawnDefinition[];

    constructor() {
        this._id = Guid.newGuid();
    }

    public get id(): string {
        return this._id;
    }

    public name: string;

    public initialized: boolean;
    public started: boolean;
    public finished: boolean;

    public spawned: SpawnDefinition[] = [];
    public assigned: IdArray<Creep>;
    

    /** Provides early-tick opportunity to update state. Will be called on all colonies and operations prior to Execute being called. */
    public update(colony: Colony): void {
        this.onUpdate(colony);
    }

    /** Main operation logic should execute here. */
    public execute(colony: Colony): void {
        this.onExecute(colony);
    }

    /** Called after all operatoins have executed. */
    public cleanup(colony: Colony): void {
        this.onCleanup(colony);
    }


    /** Called once, to initialize the operation - returns true if successful. */
    public init(colony: Colony): boolean {
        if (this.initialized)
            return true;
        if (!this.canInit(colony))
            return false;

        this.initialized = this.onInit(colony);
        return this.initialized;
    }

    /** Called once, to start the operation, and begin calls of execute. */
    public start(colony: Colony): boolean {
        if (this.started)
            return true;
        if (!this.canStart(colony))
            return false;

        this.started = this.onStart(colony);
        return this.started;
    }

    public finish(colony: Colony): void {
        this.onFinish(colony);
    }

    /** Informs the operation that a creep it needs has started to spawn. */
    public creepIsSpawning(spawnDefinition: SpawnDefinition) {
        this.spawned.push(spawnDefinition);
    }

    /** Assigns a creep to this operation. */
    public assignCreep(creep: Creep): void {
        this.assigned.push(creep);
    }

    /** Removes a creep from this operation. */
    public removeCreep(creep: Creep): void {
        var index = -1;
        for (var i = 0; i < this.assigned.length; i++) {
            if (this.assigned[i].id == creep.id) {
                index = i;
                break;
            }
        }

        if (index >= 0) {
            this.assigned.splice(index);
        }
    }

    /** Gets the total spawn requirements for the operation. */
    public getTotalCreepRequirement(colony: Colony): SpawnDefinition[] {
        if (!this._creepRequirement)
            this._creepRequirement = this.onGetCreepRequirement(colony);
        return this._creepRequirement;
    }

    /** Gets the remaining spawn requirements for the operation. */
    public getRemainingCreepRequirements(colony: Colony): SpawnDefinition[] {
        var req = this.getTotalCreepRequirement(colony);
        var remaining: SpawnDefinition[] = [];
        var skip: number[] = []; // used to make sure we don't compare against an existing spawn twice
        // for instnace, if two identical defitions are included, we want to avoid one of them blocking
        // the others spawn

        for (var i = 0; i < req.length; i++) {
            var found = false;

            for (var j = 0; j < this.spawned.length; j++) {
                var doSkip = false;
                for (var k = 0; k < skip.length; k++) {
                    if (j == skip[k]) {
                        doSkip = true;
                        break;
                    }
                }
                if (doSkip)
                    continue;

                if (req[i].isEqual(this.spawned[j])) {
                    found = true;
                    skip.push(j)
                    break;
                }    
            }

            if (!found)
                remaining.push(req[i]);
        }
        return remaining;
    }

    public abstract canInit(colony: Colony): boolean;
    public abstract canStart(colony: Colony): boolean;
    public abstract isFinished(colony: Colony): boolean;

    /** Called once, to initialize the operation - returns true if successful. */
    protected abstract onInit(colony: Colony): boolean;
    /** Called once, to start the operation, and begin calls of execute. */
    protected abstract onStart(colony: Colony): boolean;
    /** Called once, after isFinished() returns true. */
    protected abstract onFinish(colony: Colony): boolean;
    
    /** Provides early-tick opportunity to update state. Will be called on all colonies and operations prior to Execute being called. */
    protected abstract onUpdate(colony: Colony): void;
    /** Main operation logic should execute here. */
    protected abstract onExecute(colony: Colony): void;
    /** Called after all operatoins have executed. */
    protected abstract onCleanup(colony: Colony): void;

    /** Gets the creeps that this operation wants. */
    protected abstract onGetCreepRequirement(colony: Colony): SpawnDefinition[];
}

