import { Colony } from "../../../lib/colony/Colony";
import { Operation } from "../../../lib/operation/Operation";
import { Assignment } from "../../../lib/operation/Assignment";
import { BodyRepository } from "../../creep/BodyRepository";

export class RemoteHarvestScoutOperation extends Operation {
    public static fromMemory(memory: RemoteHarvestScountOperationMemory): Operation {
        var op = new this();
        op.targetRoom = memory.targetRoom;
        op.nextRoom = memory.nextRoom;
        op.moveTarget = memory.moveTarget;
        return Operation.fromMemory(memory, op);
    }

    constructor() {
        super(OPERATION_REMOTE_HARVEST_SCOUT, RemoteHarvestScoutOperation.getAssignments());        
    }


    public targetRoom: string;
    public nextRoom: string;
    public moveTarget: { x: number, y: number };


    private static getAssignments(): Assignment[] {
        return [
            new Assignment("", BodyRepository.scout())
        ];
    }

    public canInit(colony: Colony): boolean {
        return true;
    }

    public canStart(colony: Colony): boolean {
        return this.getFilledAssignmentCount() >= 1;
    }

    public isFinished(colony: Colony): boolean {
        return !this.targetRoom && !colony.remoteMiningManager.getClosestUnscoutedRoom(colony.nest.roomName);
    }

    
    protected onInit(colony: Colony): boolean {
        return true;
    }

    protected onStart(colony: Colony): boolean {
        return true;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel() {
    }

    protected onLoad(): void {
    }

    protected onUpdate(colony: Colony): void {
    }

    protected onExecute(colony: Colony): void {
        if (!this.assignments[0].creepName)
            return;
        let creep = Game.creeps[this.assignments[0].creepName];
        if (!creep)
            return;

        if (!this.targetRoom) {
            this.getNextTarget(colony, creep);
        }

        if (this.targetRoom && creep.room.name == this.targetRoom) {
            colony.remoteMiningManager.scoutRoom(this.targetRoom);
            this.getNextTarget(colony, creep);
        }

        if (this.targetRoom) {
            if (!this.nextRoom || this.nextRoom == creep.room.name) {
                let route = Game.map.findRoute(creep.room, this.targetRoom);
                if (route == -2) {
                    this.targetRoom = "";
                } else {
                    if (route.length) {
                        this.nextRoom = route[0].room;
                        let exit = creep.pos.findClosestByRange(route[0].exit);
                        this.moveTarget = { x: exit.x, y: exit.y };
                    }
                }
            }

            creep.moveTo(this.moveTarget.x, this.moveTarget.y);
        }        
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onAssignment(assignment: Assignment): void {
    }

    private getNextTarget(colony: Colony, creep: Creep): void {        
        this.targetRoom = colony.remoteMiningManager.getClosestUnscoutedRoom(creep.room.name);
        this.nextRoom = "";
        this.moveTarget = undefined;
        if (this.targetRoom)
            colony.remoteMiningManager.claimScoutJob(this.targetRoom);
    }

    protected onSave(): RemoteHarvestScountOperationMemory {
        return {
            type: this.type,
            initialized: this.initialized,
            started: this.started,
            finished: this.finished,
            assignments: this.getAssignmentMemory(),
            targetRoom: this.targetRoom,
            nextRoom: this.nextRoom,
            moveTarget: this.moveTarget
        };
    }
}

export interface RemoteHarvestScountOperationMemory extends OperationMemory {
    targetRoom: string;
    nextRoom: string;
    moveTarget: { x: number, y: number };
}
