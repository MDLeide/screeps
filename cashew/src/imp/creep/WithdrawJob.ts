import { Job } from "lib/creep/Job";
import { Task } from "lib/creep/Task";

export class WithdrawJob extends Job {
    public static fromMemory(memory: JobMemory): WithdrawJob {        
        let job = new this(null);
        return Job.fromMemory(memory, job) as WithdrawJob;
    }

    constructor(target: WithdrawTarget) {
        super(CREEP_CONTROLLER_WITHDRAW, Task.Withdraw(target));
    }

    protected isCompleted(creep: Creep): boolean {
        return creep.carry.energy > 0 || !this.currentTask || this.currentTask.complete;
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
