import { Role } from "./Role";
import { Task } from "./Task"

/**
 Job is a type of controller that uses tasks to control the creep,
and has a discrete finishing point.
 */
export abstract class Job extends Role {
    public static fromMemory<T extends Job>(memory: JobMemory, instance: T): T {
        instance.complete = memory.complete;
        return Role.fromMemory(memory, instance);
    }

    public complete: boolean;

    protected onUpdate(creep: Creep): void {
        if (this.isCompleted())
            this.complete = true;
        if (this.complete)
            return;
        super.onUpdate(creep);
    }

    protected onExecute(creep: Creep): void {
        if (this.complete)
            return;
        super.onExecute(creep);
    }

    protected onCleanup(creep: Creep): void {
        if (this.complete)
            return;
        super.onCleanup(creep);
    }

    protected onSave(): JobMemory {
        return {
            type: this.type,
            lastTask: this.lastTask ? this.lastTask.save() : undefined,
            currentTask: this.currentTask ? this.currentTask.save() : undefined,
            complete: this.complete
        };
    }

    protected abstract isCompleted(): boolean;
}
