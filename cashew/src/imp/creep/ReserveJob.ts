import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";

export class ReserveJob extends Job {
    public static fromMemory(memory: ReserveJobMemory): ReserveJob {
        let reserve = new this(memory.roomName);
        return Job.fromMemory(memory, reserve) as ReserveJob;
    }

    constructor(targetRoomName: string) {
        super(CREEP_CONTROLLER_RESERVE);
        this.roomName = targetRoomName;
    }


    public roomName: string;
    public room: Room;


    protected onLoad(): void {
        if (this.roomName)
            this.room = Game.rooms[this.roomName];
    }

    protected onUpdate(creep: Creep): void { }

    protected onExecute(creep: Creep): void { }

    protected onCleanup(creep: Creep): void { }

    protected isCompleted(creep: Creep): boolean {
        return false;
    }

    protected getNextTask(creep: Creep): Task {
        if (this.room)
            return Task.Reserve(this.room.controller);
        else
            return Task.MoveTo(new RoomPosition(25, 25, this.roomName), 23);
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onSave(): ReserveJobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete,
            roomName: this.roomName
        };
    }
}

export interface ReserveJobMemory extends JobMemory {
    roomName: string;
}
