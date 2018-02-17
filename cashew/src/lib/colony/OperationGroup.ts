import { Colony } from "./Colony"
import { ColonyOperation } from "./ColonyOperation"
import { ColonyOperationRepository } from "./repo/ColonyOperationRepository";

import { Guid } from "../../util/GUID";

export class OperationGroup {
    private _newOperations: { [opId: string]: ColonyOperation };
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
            newOps: [],
            initializedOps: [],
            runningOps: [],
            completedOps: [],
            id: Guid.newGuid()
        };

        this._newOperations = {};
        for (var i = 0; i < operations.length; i++) {
            this.state.newOps.push(operations[i].id);
            this._newOperations[operations[i].id] = operations[i];
        }
    }


    public state: OperationGroupMemory;

    public get id(): string { return this.state.id; }
    public get newOperations(): { [opId: string]: ColonyOperation } {
        if (!this._newOperations) {
            this._newOperations = {}
            global.logger.log("Loading operations from memory.", "blue", "Operation Group");
            for (var i = 0; i < this.state.newOps.length; i++) {                
                this._newOperations[this.state.newOps[i]] = this.colonyOperationRepository.find(this.state.newOps[i]);
            }
        }
        return this._newOperations;
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
        for (var key in this.newOperations) {
            this.newOperations[key].update(colony);
        }

        for (var key in this.newOperations) {
            var newOp = this.newOperations[key];
            if (newOp.initialized)
                continue;

            if (newOp.canInit(colony)) {
                if (newOp.init(colony)) {
                    this.initializedOperations[key] = newOp;
                    this.state.initializedOps.push(key);
                    delete this.newOperations[key];
                    delete this.state.newOps[key];
                }
            }
        }

        for (var key in this.initializedOperations) {
            var initOp = this.initializedOperations[key];
            if (initOp.started)
                continue;

            if (initOp.canStart(colony)) {
                if (initOp.start(colony)) {
                    this.runningOperations[key] = initOp;
                    this.state.runningOps.push(key);
                    delete this.initializedOperations[key];
                    delete this.state.initializedOps[key];
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
        for (var key in this.newOperations)
            this.newOperations[key].cleanup(colony);
        
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
        if (req.length < 1)
            return;

        global.logger.log(`Attempting to spawning ${req.length} creeps for ${op.name} [${op.id}]`, "orange", "Operation Group");
        for (var i = 0; i < req.length; i++) {
            if (!colony.canSpawn(req[i]))
                break;

            var response = colony.spawnCreep(req[i]);
            global.logger.log(`Response: ${response.name}`, "orange", "Operation Group");
            if (response) {
                op.assignCreep(response.name);
            }
        }
    }
}
