import { JobOperation } from "lib/operation/JobOperation";
import { Assignment } from "lib/operation/Assignment";
import { Job } from "lib/creep/Job";
import { Colony } from "lib/colony/Colony";
import { InitStatus, StartStatus } from "lib/operation/Operation";
import { ScoutJob } from "../../creep/ScoutJob";

export class MapScoutOperation extends JobOperation {
    public static fromMemory(memory: MapScoutOperationMemory): MapScoutOperation {
        let op = new this(memory.path);
        op.targetRoomName = memory.targetRoom;
        return JobOperation.fromMemory(memory, op) as MapScoutOperation;
    }

    constructor(path: string[]) {
        super(OPERATION_MAP_SCOUT, []);
        this.path = path;
    }

    public path: string[] = [];
    public targetRoomName: string;
    public targetRoom: Room;

    private getNextRoom(): void {
        if (this.path.length) {
            this.targetRoomName = this.path.splice(0, 1)[0];
            this.targetRoom = Game.rooms[this.targetRoomName];
            if (!global.empire.map.rooms[this.targetRoomName])
                global.empire.map.addRoom(this.targetRoomName);
        }
    }

    public assignCreep(assignment: Assignment, creepName: string): boolean {
        if (super.assignCreep(assignment, creepName)) {
            if (this.targetRoomName)
                global.empire.map.rooms[this.targetRoomName].scoutedBy = creepName;
            for (var i = 0; i < this.path.length; i++)
                global.empire.map.rooms[this.path[i]].scoutedBy = creepName;            
        }
        return false;
    }

    protected getJob(assignment: Assignment): Job {
        return new ScoutJob(this.targetRoomName);
    }

    public isFinished(colony: Colony): boolean {
        return !this.targetRoomName && (!this.path || !this.path.length);
    }

    protected onLoad(): void {
        if (this.targetRoomName) this.targetRoom = Game.rooms[this.targetRoomName];
    }

    protected onUpdate(colony: Colony): void {
        if (this.targetRoom) {
            global.empire.map.scoutRoom(this.targetRoom);
            this.getNextRoom();
            this.onUpdate(colony);
        }
    }

    protected onExecute(colony: Colony): void {
    }

    protected onCleanup(colony: Colony): void {
    }

    protected onInit(colony: Colony): InitStatus {
        this.getNextRoom();
        return InitStatus.Initialized;
    }

    protected onStart(colony: Colony): StartStatus {
        if (this.getFilledAssignmentCount() >= 1)
            return StartStatus.Started;
        return StartStatus.TryAgain;
    }

    protected onFinish(colony: Colony): boolean {
        return true;
    }

    protected onCancel(colony: Colony): void {        
    }
}

export interface MapScoutOperationMemory extends JobOperationMemory {
    path: string[];
    targetRoom: string;
}
