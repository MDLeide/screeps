import { Colony } from "./Colony"
import { ColonyOperation } from "./ColonyOperation"
import { ColonyOperationRepository } from "./repo/ColonyOperationRepository";

import { Guid } from "../../util/GUID";

export class OperationGroup {
    private _operations: { [opId: string]: ColonyOperation };
    private _initializedOperations: { [opId: string]: ColonyOperation };
    private _runningOperations: { [opId: string]: ColonyOperation };    

    private _colonyOperationRepository: ColonyOperationRepository;
    private get colonyOperationRepository(): ColonyOperationRepository {
        if (!this._colonyOperationRepository)
            this._colonyOperationRepository = new ColonyOperationRepository();
        return this._colonyOperationRepository;
    }


    constructor(operations: ColonyOperation[]) {
        this.state = {
            operations: [],
            initializedOps: [],
            runningOps: [],
            completedOps: [],
            id: Guid.newGuid()
        };

        this._operations = {};
        for (var i = 0; i < operations.length; i++) {
            this.state.operations.push(operations[i].id);
            this._operations[operations[i].id] = operations[i];
            this.colonyOperationRepository.add(operations[i]);
        }
    }


    public state: OperationGroupMemory;

    public get id(): string { return this.state.id; }
    public get operations(): { [opId: string]: ColonyOperation } {
        if (!this._operations) {
            this._operations = {}
            for (var i = 0; i < this.state.operations.length; i++) {
                this._operations[this.state.operations[i]] = this.colonyOperationRepository.find(this.state.operations[i]);
            }
        }
        return this._operations;
    }
    public get initializedOperations(): { [opId: string]: ColonyOperation } {
        if (!this._initializedOperations) {
            this._initializedOperations = {}
            for (var i = 0; i < this.state.initializedOps.length; i++) {
                this._initializedOperations[this.state.initializedOps[i]] = this.colonyOperationRepository.find(this.state.initializedOps[i]);
            }
        }
        return this._initializedOperations;
    }
    public get runningOperations(): { [opId: string]: ColonyOperation } {
        if (!this._runningOperations) {
            this._runningOperations = {}
            for (var i = 0; i < this.state.runningOps.length; i++) {
                this._runningOperations[this.state.runningOps[i]] = this.colonyOperationRepository.find(this.state.runningOps[i]);
            }
        }
        return this._runningOperations;
    }
    public get completedOperationNames(): string[] { return this.state.completedOps; }


    public update(colony: Colony) : void {
        // update ops
        for (var key in this.operations) {
            this.operations[key].update(colony);
        }

        for (var key in this.operations) {
            if (this.operations[key].initialized)
                continue;

            if (this.operations[key].canInit(colony)) {
                if (this.operations[key].init(colony)) {
                    this.initializedOperations[key] = this.operations[key];
                    this.state.initializedOps.push(key);
                }
            }
        }

        for (var key in this.operations) {
            if (this.operations[key].started)
                continue;

            if (this.operations[key].canStart(colony)) {
                if (this.operations[key].start(colony)) {
                    this.runningOperations[key] = this.operations[key];
                    this.state.runningOps.push(key);
                }
            }
        }        
    }

    public execute(colony: Colony) : void {
        for (var key in this.initializedOperations) {
            this.spawnCreepsForOperation(this.initializedOperations[key], colony)
        }

        for (var key in this.runningOperations) {
            this.spawnCreepsForOperation(this.runningOperations[key], colony)
        }

        for (var key in this.runningOperations) {
            this.runningOperations[key].execute(colony);
        }
    }

    public cleanup(colony: Colony) {
        for (var key in this.operations)
            this.operations[key].cleanup(colony);
        
        for (var key in this.runningOperations) {
            var op = this.runningOperations[key];
            if (op.isFinished(colony)) {
                op.finish(colony);
                this.completedOperationNames.push(op.name);
                delete this.runningOperations[key];
                var toRemove: number = -1;
                for (var i = 0; i < this.state.runningOps.length; i++) {
                    if (this.state.runningOps[i] == key)
                        toRemove = i;
                }
                this.state.runningOps.splice(toRemove);

                for (var i = 0; i < this.state.initializedOps.length; i++) {
                    if (this.state.runningOps[i] == key)
                        toRemove = i;
                }
                if (toRemove >= 0)
                    this.state.initializedOps.splice(toRemove);

                this.colonyOperationRepository.delete(op);
            }
        }
    }

     /** Spawns creeps required for an operation. */
    private spawnCreepsForOperation(op: ColonyOperation, colony: Colony) {
        var req = op.getRemainingCreepRequirements(colony);
        for (var i = 0; i < req.length; i++) {
            if (!req[i]) //todo: figure this out
                continue;
            if (!colony.canSpawn(req[i]))
                break;

            var response = colony.spawnCreep(req[i]);            
            if (response) {
                op.assignCreep(response.name);
            }
        }
    }
}
