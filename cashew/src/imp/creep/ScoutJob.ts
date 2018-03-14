import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";

export class ScoutJob extends Job {
    public static fromMemory(memory: ScoutJobMemory): ScoutJob {
        let scout = new this(memory.targetRoomName);
        return Job.fromMemory(memory, scout) as ScoutJob;
    }

    constructor(targetRoomName: string) {
        super(CREEP_CONTROLLER_SCOUT);
        this.targetRoomName = targetRoomName;
    }


    public targetRoomName: string;
    public targetRoom: Room;


    protected onLoad(): void {
        if (this.targetRoomName)
            this.targetRoom = Game.getObjectById<Room>(this.targetRoomName);
    }

    protected onUpdate(creep: Creep): void { }

    protected onExecute(creep: Creep): void { }

    protected onCleanup(creep: Creep): void { }

    protected isCompleted(creep: Creep): boolean {
        return creep.room.name == this.targetRoomName
            && creep.pos.x > 0
            && creep.pos.x < 49
            && creep.pos.y > 0
            && creep.pos.y < 49;
    }

    protected getNextTask(creep: Creep): Task {
        return Task.MoveTo(new RoomPosition(25, 25, this.targetRoomName), 24);
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onSave(): ScoutJobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete,
            targetRoomName: this.targetRoomName
        };
    }
}

export interface ScoutJobMemory extends JobMemory {
    targetRoomName: string;
}
