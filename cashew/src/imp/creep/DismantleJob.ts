import { Job } from "lib/creep/Job";
import { Task } from "lib/creep/Task";

export class DismantleJob extends Job {
    public static fromMemory(memory: JobMemory): DismantleJob {        
        let job = new this(null);
        return Job.fromMemory(memory, job) as DismantleJob;
    }

    constructor(target: Structure) {
        super(CREEP_CONTROLLER_DISMANTLER, Task.Dismantle(target));
    }

    protected isCompleted(creep: Creep): boolean {
        return !this.currentTask || this.currentTask.complete;
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
