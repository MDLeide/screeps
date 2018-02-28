//import { Guid } from "../../util/GUID";
//import { Colony } from "./Colony";
//import { ColonyOperation } from "./ColonyOperation";
//import { ColonyOperationRepository } from "./repo/ColonyOperationRepository";

///**
// This class describes on-going operations for a colony, and the requirements to trigger them. For
//example, it may describe a Repair operation to be executed when at least one structure is at 75% hp
//or less.
// */
//export class ColonyMaintenance {
//    private _pendingOperations: { [opId: string]: ColonyOperation } = {};
//    private _initializedOperations: { [opId: string]: ColonyOperation } = {};    
//    private _runningOperations: { [opId: string]: ColonyOperation } = {};
//    private _colonyOperationRepository: ColonyOperationRepository;


//    constructor(name: string, entries: MaintenanceEntry[] ) {
//        this.state = {
//            id: Guid.newGuid(),
//            name: name,
//            pendingOps: [],
//            initializedOps: [],
//            runningOps: []
//        };
//    }


//    public state: ColonyMaintenanceMemory;

//    public get id(): string { return this.state.id; }
//    public get name(): string { return this.state.name; }
//    public get pendingOperations(): { [opId: string]: ColonyOperation } {
//        if (!this._pendingOperations) {
//            this._pendingOperations = {}
//            for (var i = 0; i < this.state.initializedOps.length; i++) {
//                this._pendingOperations[this.state.pendingOps[i]] = this._colonyOperationRepository.get(this.state.pendingOps[i]);
//            }
//        }
//        return this._pendingOperations;
//    }
//    public get initializedOperations(): { [opId: string]: ColonyOperation } {
//        if (!this._initializedOperations) {
//            this._initializedOperations = {}
//            for (var i = 0; i < this.state.initializedOps.length; i++) {
//                this._initializedOperations[this.state.initializedOps[i]] = this._colonyOperationRepository.get(this.state.initializedOps[i]);
//            }
//        }
//        return this._initializedOperations;
//    }
//    public get runningOperations(): { [opId: string]: ColonyOperation } {
//        if (!this._runningOperations) {
//            this._runningOperations = {}
//            for (var i = 0; i < this.state.runningOps.length; i++) {
//                this._runningOperations[this.state.runningOps[i]] = this._colonyOperationRepository.get(this.state.runningOps[i]);
//            }
//        }
//        return this._runningOperations;
//    }

//    public entries: MaintenanceEntry[];


//    //## update loop

//    /** Updates the plan, checks for a new milestone, updates all operations. */
//    public update(colony: Colony): void {
//        for (var i = 0; i < this.entries.length; i++) {
//            if (this.entries[i].shouldStart(colony)) {
//                var op = this.entries[i].getOperation(colony);
//                this.pendingOperations[op.id] = op;
//            }                
//        }

//        for (var key in this.pendingOperations) {
//            if (this.pendingOperations[key].canInit(colony)) {
//                if (this.pendingOperations[key].init(colony)) {
//                    this.initializedOperations[key] = this.pendingOperations[key];
//                    delete this.pendingOperations[key];
//                }
//            }
//        }

//        for (var key in this.initializedOperations) {
//            if (this.initializedOperations[key].canStart(colony)) {
//                if (this.initializedOperations[key].start(colony)) {
//                    this.runningOperations[key] = this.initializedOperations[key];
//                    delete this.initializedOperations[key];
//                }
//            }
//        }
//    }

//    public execute(colony: Colony): void {
//        //todo: spawning code, figure out how to keep track of newly spawned creeps
//        // chec the colony operation
//        for (var key in this.initializedOperations) {
//            this.spawnCreepsForOperation(this.initializedOperations[key], colony)
//        }

//        for (var key in this.runningOperations) {
//            this.spawnCreepsForOperation(this.initializedOperations[key], colony)
//        }

//        for (var key in this.runningOperations) {
//            this.runningOperations[key].execute(colony);
//        }
//    }

//    public cleanup(colony: Colony): void {
//        for (var key in this.initializedOperations)
//            this.initializedOperations[key].cleanup(colony);
//        for (var key in this.runningOperations)
//            this.runningOperations[key].cleanup(colony);

//        for (var key in this.runningOperations) {
//            var op = this.runningOperations[key];
//            if (op.isFinished(colony)) {
//                op.finish(colony);                
//                delete this.runningOperations[key];
//            }
//        }
//    }

//    //## end update loop


//    /** Spawns creeps required for an operation. */
//    private spawnCreepsForOperation(op: ColonyOperation, colony: Colony) {
//        var req = op.getRemainingCreepRequirements(colony);
//        for (var i = 0; i < req.length; i++) {
//            var response = colony.spawnCreep(req[i]);
//            if (response) {
//                op.creepIsSpawning(req[i]);
//            }
//        }
//    }

//}

//export class MaintenanceEntry {
//    private _shouldStart: (colony: Colony) => boolean;
//    private _getOp: (colony: Colony) => ColonyOperation;
//    constructor(shouldStart: (colony: Colony) => boolean, getOp: (colony: Colony) => ColonyOperation) {
//        this._shouldStart = shouldStart;
//        this._getOp = getOp;
//    }
        
//    public shouldStart(colony: Colony): boolean {
//        return this._shouldStart(colony);
//    }

//    public getOperation(colony: Colony): ColonyOperation {
//        return this._getOp(colony);
//    }
//}
