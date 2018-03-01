import { Colony } from "../../../lib/colony/Colony";
import { ControllerOperation } from "../../../lib/operation/ControllerOperation";
import { Assignment } from "../../../lib/operation/Assignment";
import { CreepController } from "../../../lib/creep/CreepController";
import { BodyRepository } from "../../creep/BodyRepository";
import { RemoteHarvesterController } from "../../creep/RemoteHarvesterController";
import { RemoteHaulerRole } from "../../creep/RemoteHaulerRole";

export class RemoteHarvestOperation extends ControllerOperation {
    public static fromMemory(memory: RemoteHarvestOperationMemory): RemoteHarvestOperation {
        let op = new this(memory.sourceId, memory.roomName);
        op.containerId = memory.containerId;
        return ControllerOperation.fromMemory(memory, op) as RemoteHarvestOperation;
    }

    constructor(sourceId: string, roomName: string) {
        super(OPERATION_REMOTE_HARVEST, RemoteHarvestOperation.getAssignments());
        this.sourceId = sourceId;
        this.roomName = roomName;
    }


    public sourceId: string;
    public containerId: string;
    public roomName: string;


    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.heavyHarvester(), CREEP_CONTROLLER_REMOTE_HARVESTER)            
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


    protected getController(assignment: Assignment): CreepController {
        if (assignment.controllerType == CREEP_CONTROLLER_REMOTE_HARVESTER) {
            return new RemoteHarvesterController(this.sourceId, this.roomName, this.containerId)
        } else {
            return new RemoteHaulerRole(this.containerId, this.roomName);
        }
    }

    protected onInit(colony: Colony): boolean {
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
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
        if (!this.containerId) {
            for (var key in this.controllers) {
                if (this.controllers[key] && this.controllers[key].type == CREEP_CONTROLLER_REMOTE_HARVESTER)
                    this.containerId = (this.controllers[key] as RemoteHarvesterController).containerId;                    
            }
        } else if (this.assignments.length < 2) {
            this.assignments.push(new Assignment("", BodyRepository.hauler(), CREEP_CONTROLLER_REMOTE_HAULER)); //todo: carry parts
        }
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onRelease(assignment: Assignment): void {
    }
    
    protected onSave(): RemoteHarvestOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            controllers: this.getControllerMemory(),
            sourceId: this.sourceId,
            containerId: this.containerId,
            roomName: this.roomName
        };
    }
}

export interface RemoteHarvestOperationMemory extends ControllerOperationMemory {
    sourceId: string;
    containerId: string;
    roomName: string;
}
