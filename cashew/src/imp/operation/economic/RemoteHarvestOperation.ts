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
    public containerId: string;

        
    private static getAssignments(): Assignment[] {
        let body = BodyRepository.heavyHarvester();
        body.waitForFullEnergy = true;
        return [
            new Assignment("", body, CREEP_CONTROLLER_REMOTE_HARVESTER, 500)            
        ];
    }


    public isFinished(colony: Colony): boolean {
        return false;
    }


    protected getController(assignment: Assignment): CreepController {        
        if (assignment.controllerType == CREEP_CONTROLLER_REMOTE_HARVESTER) {
            return new RemoteHarvesterController(this.sourceId, this.roomName, this.containerId)
        } else {
            return new RemoteHaulerRole(this.containerId, this.roomName);
        }
    }


    protected onInit(colony: Colony): InitStatus {
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() < 1)
            return StartStatus.TryAgain;
        return StartStatus.Started;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(colony: Colony): void {
    }


    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
        this.updateContainerId();
        if (!this.containerId)
            return;

        let container = Game.getObjectById<StructureContainer>(this.containerId);

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

    private updateContainerId(): void {
        let room = Game.rooms[this.roomName];
        if (!room) return;
        if (!this.containerId)
            this.containerId = this.findContainerId();
        if (!this.containerId) return;
        let container = Game.getObjectById<StructureContainer>(this.containerId);
        if (!container)
            this.containerId = this.findContainerId();
    }

    private findContainerId(): string {
        let source = Game.getObjectById<Source>(this.sourceId);
        if (!source) return undefined;
        let containers = source.pos.findInRange<StructureContainer>(FIND_STRUCTURES, 2, { filter: p => p.structureType == STRUCTURE_CONTAINER });
        if (containers.length)
            return containers[0].id;
        return undefined;
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
                let workParts = reserved ? 4 : 2;
                this.assignments[i].body.maxCompleteScalingSections = workParts;
                this.assignments[i].body.minimumEnergy = Math.min(colony.nest.room.energyCapacityAvailable, workParts * BODYPART_COST[WORK] + BODYPART_COST[MOVE] + BODYPART_COST[CARRY]);
            }                
            else if (this.assignments[i].controllerType == CREEP_CONTROLLER_REMOTE_HAULER) {
                this.assignments[i].replaceAt = leadTime / 2;
                this.assignments[i].body.maxCompleteScalingSections = carryParts - 1;
            }                
        }            
    }

    public save(): RemoteHarvestOperationMemory {
        let mem = super.save() as RemoteHarvestOperationMemory;
        mem.sourceId = this.sourceId;
        mem.roomName = this.roomName;
        return mem;
    }
}

export interface RemoteHarvestOperationMemory extends ControllerOperationMemory {
    sourceId: string;
    roomName: string;
}
