import { Job } from "../../lib/creep/Job";
import { Task } from "../../lib/creep/Task";

export class ClaimJob extends Job {
    public static fromMemory(memory: ClaimJobMemory): ClaimJob {
        let claim = new this(memory.targetRoomName);
        return Job.fromMemory(memory, claim) as ClaimJob;
    }

    constructor(targetRoomName: string) {
        super(CREEP_CONTROLLER_CLAIM);
        this.targetRoomName = targetRoomName;
    }


    public targetRoomName: string;
    public targetRoom: Room;


    protected onLoad(): void {
        if (this.targetRoomName)
            this.targetRoom = Game.rooms[this.targetRoomName];
    }

    protected onUpdate(creep: Creep): void { }

    protected onExecute(creep: Creep): void { }

    protected onCleanup(creep: Creep): void { }

    protected isCompleted(creep: Creep): boolean {
        let room = Game.rooms[this.targetRoomName];
        return room && room.controller && room.controller.my;
    }

    protected getNextTask(creep: Creep): Task {
        if (creep.room.name == this.targetRoomName) {
            return Task.Claim(this.targetRoom.controller);
        } else {
            return Task.MoveTo(new RoomPosition(25, 25, this.targetRoomName), 24);
        }
    }

    protected isIdle(creep: Creep): Task {
        return this.getNextTask(creep);
    }

    protected onSave(): ClaimJobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete,
            targetRoomName: this.targetRoomName
        };
    }
}

export interface ClaimJobMemory extends JobMemory {
    targetRoomName: string;
}
