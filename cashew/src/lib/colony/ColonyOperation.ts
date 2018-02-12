import { Colony } from "./Colony";

import { SpawnDefinition } from "../spawn/SpawnDefinition";

//import { StatefulArray } from "../../util/StatefulArray";
//import { IdArray } from "../../util/IdArray";
import { Guid } from "../../util/GUID";

export abstract class ColonyOperation {    
    private _creepRequirement: SpawnDefinition[];    
    private _assigned: string[];

    constructor(name: string) {
        this.state = {
            id: Guid.newGuid(),
            name: name,
            initialized: false,
            started: false,
            finished: false,
            spawned: [],
            assignedIds: []
        }        
    }

    public state: ColonyOperationMemory;

    public get id(): string { return this.state.id; }

    public get name(): string { return this.state.name; }

    public get initialized(): boolean { return this.state.initialized; }
    public set initialized(val: boolean) { this.state.initialized = val; }

    public get started(): boolean { return this.state.started; }
    public set started(val: boolean) { this.state.started = val; }

    public get finished(): boolean { return this.state.finished; }
    public set finished(val: boolean) { this.state.finished = val; }
    
    public get assigned(): string[] {
        if (!this._assigned)
            this._assigned = [];
        return this._assigned;
    }
    

    /** Provides early-tick opportunity to update state. Will be called on all colonies and operations prior to Execute being called. */
    public update(colony: Colony): void {
        this.cleanDeadCreeps(colony);
        this.onUpdate(colony);
    }

    /** Ensures we don't have any dead creeps assigned to the operation. */
    private cleanDeadCreeps(colony: Colony) {
        var toRemove: number[] = [];
        for (var i = 0; i < this.assigned.length; i++) {
            if (colony.population.didDieRecently(this.assigned[i]))
                toRemove.push(i);
        }

        for (var i = toRemove.length - 1; i >= 0; i--) {
            this.assigned.splice(toRemove[i]);
        }
    }

    /** Main operation logic should execute here. */
    public execute(colony: Colony): void {
        for (var i = 0; i < this.assigned.length; i++) {
            var creep = Game.creeps[this.assigned[i]];
            if (!creep.spawning)
                creep.nut.role.execute();
        }
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
    
    /** Assigns a creep to this operation. */
    public assignCreep(creepName: string): void {
        this.assigned.push(creepName);
    }

    /** Removes a creep from this operation. */    
    public removeCreep(creepName: string)
    {
        var index = -1;
        for (var i = 0; i < this.assigned.length; i++) {
            if (this.assigned[i] == creepName) {
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
        var toSkip: number[] = []; // used to make sure a single assigned creep does not count
        // for multiples when comparing assigned vs required

        // we will check each requirement against the list of assigned creeps
        for (var i = 0; i < req.length; i++) {
            var found = false;
            for (var j = 0; j < this.assigned.length; j++) {
                if (this.doSkip(j, toSkip))
                    continue;

                var assignedCreepRole = Memory.creeps[this.assigned[j]].roleId;
                if (req[i].roleId == assignedCreepRole) {
                    toSkip.push(j);
                    found = true;
                    break;
                }
            }
            if (!found) {
                remaining.push(req[i]);
            }
        }
        return remaining;
    }
    // helper
    private doSkip(index: number, array: number[]): boolean {
        for (var i = 0; i < array.length; i++)
            if (array[i] == index)
                return true;
        return false;
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

