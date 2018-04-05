import { Job } from "lib/creep/Job";
import { Task } from "lib/creep/Task";

export class TransferJob extends Job {
    public static fromMemory(memory: JobMemory): TransferJob {
        let job = new this(null);
        return Job.fromMemory(memory, job) as TransferJob;
    }

    constructor(target: TransferTarget) {
        super(CREEP_CONTROLLER_TRANSFER, Task.Transfer(target));
    }

    protected isCompleted(creep: Creep): boolean {
        return creep.carry.energy == 0 || !this.currentTask || this.currentTask.finished || this.currentTask.type == TASK_IDLE;
    }

    protected getNextTask(creep: Creep): Task {
        return null;
    }

    protected isIdle(creep: Creep): Task {
        return null;
    }

    protected onUpdate(creep: Creep): void {
    }

    protected onExecute(creep: Creep): void {
    }

    protected onCleanup(creep: Creep): void {
    }
}
