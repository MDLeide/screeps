import { Colony } from "../../../lib/colony/Colony";
import { Operation, InitStatus, StartStatus } from "../../../lib/operation/Operation";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { Body } from "../../../lib/creep/Body";
import { BodyRepository } from "../../creep/BodyRepository";
import { RemoteHarvesterController } from "../../creep/RemoteHarvesterController";
import { RemoteHaulerRole } from "../../creep/RemoteHaulerRole";
import { Calculator } from "../../../lib/util/Calculator";

export class RemoteHarvestOperation extends ControllerOperation {
    public static fromMemory(memory: RemoteHarvestOperationMemory): RemoteHarvestOperation {
        let op = new this(memory.sourceId, memory.roomName);        
        return ControllerOperation.fromMemory(memory, op) as RemoteHarvestOperation;
    }

    constructor(sourceId: string, roomName: string) {
        super(OPERATION_REMOTE_HARVEST, RemoteHarvestOperation.getAssignments());
        this.sourceId = sourceId;
        this.roomName = roomName;
    }


    public sourceId: string;    
    public roomName: string;
    public colony: Colony;

        
    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.heavyHarvester(), CREEP_CONTROLLER_REMOTE_HARVESTER, 500)            
        ];
    }


    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected onInit(colony: Colony): InitStatus {
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        if (this.sourceId) {
            let remoteSource = colony.remoteMiningManager.getRemoteSourceById(this.sourceId);
            if (remoteSource)
                remoteSource.beingMined = false;
        }
            
        return true;
    }

    protected onCancel(): void {
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        this.colony = colony;

        let remoteSource = colony.remoteMiningManager.getRemoteSourceById(this.sourceId);        
        if (!remoteSource.containerId) return;

        let container = Game.getObjectById<StructureContainer>(remoteSource.containerId);        
        if (container && this.assignments.length < 2) {            
            this.assignments.push(new Assignment("", BodyRepository.hauler(), CREEP_CONTROLLER_REMOTE_HAULER, 150));
            this.updateAssignments(colony);
        } else if (Game.time % 500 == 150) {
            this.updateAssignments(colony);
        }
            
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }


    private updateAssignments(colony: Colony): void {
        let source = Game.getObjectById<Source>(this.sourceId);
        if (!source) return;
        let spawn = colony.nest.spawners[0].spawn;

        let body = [WORK, WORK, WORK, WORK, WORK, MOVE, CARRY];
        let path = PathFinder.search(spawn.pos, { pos: source.pos, range: 1 });
        
        let transit = Calculator.estimateTransitTimeFromCost(body, path.cost, true);
        let spawnTime = body.length * CREEP_SPAWN_TIME;
        let leadTime = transit + spawnTime;
        let reserved = source.room.controller.reservation && source.room.controller.reservation.ticksToEnd > 0;
        let income = reserved ? 10 : 5;

        let carryParts = (path.cost * income * 2) / CARRY_CAPACITY;

        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].controllerType == CREEP_CONTROLLER_REMOTE_HARVESTER) {
                this.assignments[i].replaceAt = leadTime;
                this.assignments[i].body.maxCompleteScalingSections = reserved ? 4 : 2;
            }                
            else if (this.assignments[i].controllerType == CREEP_CONTROLLER_REMOTE_HAULER) {
                this.assignments[i].body.maxCompleteScalingSections = carryParts - 1;
            }                
        }            
    }


    protected onRelease(assignment: Assignment): void {
    }

    protected onReplacement(assignment: Assignment): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    
    protected getController(assignment: Assignment): CreepController {
        let remoteSource = this.colony.remoteMiningManager.getRemoteSourceById(this.sourceId);        
        if (assignment.controllerType == CREEP_CONTROLLER_REMOTE_HARVESTER) {
            return new RemoteHarvesterController(this.sourceId, this.roomName, remoteSource.containerId)
        } else {
            return new RemoteHaulerRole(remoteSource.containerId, this.roomName);
        }
    }

    
    protected onSave(): RemoteHarvestOperationMemory {
        return {
            type: this.type,
            initializedStatus: this.initializedStatus,
            startedStatus: this.startedStatus,
            operationStatus: this.status,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            sourceId: this.sourceId,
            roomName: this.roomName
        };
    }
}

export interface RemoteHarvestOperationMemory extends ControllerOperationMemory {
    sourceId: string;
    roomName: string;
}
